from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
import sqlite3
import uuid
import os
import requests
import json
from datetime import datetime
import logging

# Configure logging
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="E-commerce AI Agent API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    user_id: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    message_id: int

class Message(BaseModel):
    id: int
    role: str
    content: str
    timestamp: str

class Conversation(BaseModel):
    id: str
    user_id: str
    session_id: str
    messages: List[Message]
    created_at: str
    updated_at: str

# Database functions
def get_db_connection():
    return sqlite3.connect("ecommerce.db")

def get_or_create_conversation(user_id: str, conversation_id: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if conversation_id:
        # Get existing conversation
        cursor.execute(
            "SELECT id, session_id FROM conversations WHERE id = ? AND user_id = ?",
            (conversation_id, user_id)
        )
        result = cursor.fetchone()
        if result:
            conn.close()
            return result[0], result[1]
    
    # Create new conversation
    session_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO conversations (user_id, session_id) VALUES (?, ?)",
        (user_id, session_id)
    )
    new_conversation_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_conversation_id, session_id

def save_message(conversation_id: int, role: str, content: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",
        (conversation_id, role, content)
    )
    message_id = cursor.lastrowid
    
    # Update conversation timestamp
    cursor.execute(
        "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (conversation_id,)
    )
    
    conn.commit()
    conn.close()
    return message_id

def get_conversation_history(conversation_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, role, content, timestamp 
        FROM messages 
        WHERE conversation_id = ? 
        ORDER BY timestamp ASC
    """, (conversation_id,))
    
    messages = []
    for row in cursor.fetchall():
        messages.append({
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "timestamp": row[3]
        })
    
    conn.close()
    return messages

# LLM Integration with Groq
class GroqLLM:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        
        if not self.api_key:
            logger.warning("GROQ_API_KEY not found. Using mock responses.")
    
    def query_database(self, query: str):
        """Query the e-commerce database based on the user's question"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Simple keyword-based query routing
        query_lower = query.lower()
        
        if "product" in query_lower or "item" in query_lower:
            if "category" in query_lower:
                cursor.execute("SELECT DISTINCT category FROM products LIMIT 10")
                results = cursor.fetchall()
                return f"Available product categories: {[row[0] for row in results]}"
            elif "brand" in query_lower:
                cursor.execute("SELECT DISTINCT brand FROM products LIMIT 10")
                results = cursor.fetchall()
                return f"Available brands: {[row[0] for row in results]}"
            else:
                cursor.execute("SELECT name, brand, category, retail_price FROM products LIMIT 5")
                results = cursor.fetchall()
                return f"Sample products: {[{'name': row[0], 'brand': row[1], 'category': row[2], 'price': row[3]} for row in results]}"
        
        elif "order" in query_lower or "purchase" in query_lower:
            cursor.execute("SELECT COUNT(*) FROM orders")
            total_orders = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'delivered'")
            delivered_orders = cursor.fetchone()[0]
            return f"Total orders: {total_orders}, Delivered orders: {delivered_orders}"
        
        elif "user" in query_lower or "customer" in query_lower:
            cursor.execute("SELECT COUNT(*) FROM users")
            total_users = cursor.fetchone()[0]
            return f"Total customers: {total_users}"
        
        elif "revenue" in query_lower or "sales" in query_lower:
            cursor.execute("SELECT SUM(sale_price) FROM order_items")
            total_revenue = cursor.fetchone()[0]
            return f"Total revenue: ${total_revenue:,.2f}" if total_revenue else "No revenue data available"
        
        else:
            return "I can help you with information about products, orders, customers, and sales. What would you like to know?"
        
        conn.close()
    
    def generate_response(self, user_message: str, conversation_history: List[dict]):
        """Generate AI response using Groq API"""
        if not self.api_key:
            # Mock response for testing
            db_result = self.query_database(user_message)
            return f"I'm here to help with your e-commerce questions! {db_result}"
        
        # Build conversation context
        messages = [
            {
                "role": "system",
                "content": """You are an AI assistant for an e-commerce platform. You help users with:
                1. Product information and recommendations
                2. Order status and history
                3. Customer support
                4. Sales and analytics data
                
                Always be helpful, friendly, and provide accurate information based on the available data."""
            }
        ]
        
        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        try:
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result["choices"][0]["message"]["content"]
                
                # Enhance response with database query if relevant
                if any(keyword in user_message.lower() for keyword in ["product", "order", "user", "revenue", "sales"]):
                    db_result = self.query_database(user_message)
                    ai_response += f"\n\nBased on our database: {db_result}"
                
                return ai_response
            else:
                logger.error(f"Groq API error: {response.status_code} - {response.text}")
                return "I'm having trouble connecting to my AI service right now. Let me help you with basic information from our database."
                
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            db_result = self.query_database(user_message)
            return f"I'm experiencing some technical difficulties, but I can still help you with basic information: {db_result}"

# Initialize LLM
llm = GroqLLM()

# API Endpoints
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Get or create conversation
        conversation_id, session_id = get_or_create_conversation(
            request.user_id, 
            request.conversation_id
        )
        
        # Get conversation history
        history = get_conversation_history(conversation_id)
        
        # Generate AI response
        ai_response = llm.generate_response(request.message, history)
        
        # Save user message
        user_message_id = save_message(conversation_id, "user", request.message)
        
        # Save AI response
        ai_message_id = save_message(conversation_id, "assistant", ai_response)
        
        return ChatResponse(
            response=ai_response,
            conversation_id=str(conversation_id),
            message_id=ai_message_id
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/conversations/{user_id}", response_model=List[Conversation])
async def get_user_conversations(user_id: str):
    """Get all conversations for a user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT c.id, c.session_id, c.created_at, c.updated_at
            FROM conversations c
            WHERE c.user_id = ?
            ORDER BY c.updated_at DESC
        """, (user_id,))
        
        conversations = []
        for row in cursor.fetchall():
            conv_id, session_id, created_at, updated_at = row
            
            # Get messages for this conversation
            cursor.execute("""
                SELECT id, role, content, timestamp
                FROM messages
                WHERE conversation_id = ?
                ORDER BY timestamp ASC
            """, (conv_id,))
            
            messages = []
            for msg_row in cursor.fetchall():
                messages.append(Message(
                    id=msg_row[0],
                    role=msg_row[1],
                    content=msg_row[2],
                    timestamp=msg_row[3]
                ))
            
            conversations.append(Conversation(
                id=str(conv_id),
                user_id=user_id,
                session_id=session_id,
                messages=messages,
                created_at=created_at,
                updated_at=updated_at
            ))
        
        conn.close()
        return conversations
        
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 