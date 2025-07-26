# E-commerce AI Agent Backend

This is the backend service for the conversational AI agent that helps users with e-commerce queries.

## Features

- **Database Integration**: SQLite database with e-commerce data (users, products, orders, etc.)
- **Conversation Management**: Store and retrieve conversation histories for multiple users
- **LLM Integration**: Powered by Groq API for intelligent responses
- **RESTful API**: FastAPI-based endpoints for chat functionality

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Database**:
   ```bash
   python db.py
   python load_data.py
   ```

3. **Set Environment Variable** (Optional):
   ```bash
   export GROQ_API_KEY="your_groq_api_key_here"
   ```
   If not set, the service will use mock responses for testing.

4. **Run the Server**:
   ```bash
   python main.py
   ```
   Or with uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

### POST /api/chat
Main chat endpoint for user interactions.

**Request Body**:
```json
{
  "message": "What products do you have?",
  "user_id": "user123",
  "conversation_id": "optional_existing_conversation_id"
}
```

**Response**:
```json
{
  "response": "I can help you find products! Here are some categories...",
  "conversation_id": "1",
  "message_id": 5
}
```

### GET /api/conversations/{user_id}
Get all conversations for a specific user.

**Response**:
```json
[
  {
    "id": "1",
    "user_id": "user123",
    "session_id": "uuid-session-id",
    "messages": [
      {
        "id": 1,
        "role": "user",
        "content": "Hello",
        "timestamp": "2024-01-01T10:00:00"
      }
    ],
    "created_at": "2024-01-01T10:00:00",
    "updated_at": "2024-01-01T10:05:00"
  }
]
```

### GET /api/health
Health check endpoint.

## Database Schema

### E-commerce Tables
- `users`: Customer information
- `products`: Product catalog
- `orders`: Order records
- `order_items`: Individual items in orders
- `inventory_items`: Inventory tracking
- `distribution_centers`: Warehouse locations

### Conversation Tables
- `conversations`: Conversation sessions
- `messages`: Individual messages in conversations

## LLM Integration

The service integrates with Groq's LLM API to provide intelligent responses. The AI can:
- Answer questions about products, orders, and customers
- Provide sales analytics
- Help with customer support queries
- Ask clarifying questions when needed

## Development

The backend is built with:
- **FastAPI**: Modern, fast web framework
- **SQLite**: Lightweight database
- **Pydantic**: Data validation
- **Groq API**: LLM integration

## Testing

You can test the API using curl or any HTTP client:

```bash
# Test chat endpoint
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What products do you have?", "user_id": "test_user"}'

# Test health endpoint
curl "http://localhost:8000/api/health"
``` 