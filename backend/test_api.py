#!/usr/bin/env python3
"""
Test script for the E-commerce AI Agent API
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_chat():
    """Test the chat endpoint"""
    print("\nTesting chat endpoint...")
    
    test_cases = [
        {
            "message": "Hello, what products do you have?",
            "user_id": "test_user_1"
        },
        {
            "message": "How many orders do you have?",
            "user_id": "test_user_1"
        },
        {
            "message": "What are your top selling products?",
            "user_id": "test_user_2"
        }
    ]
    
    conversation_id = None
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test_case['message']}")
        
        payload = {
            "message": test_case["message"],
            "user_id": test_case["user_id"]
        }
        
        if conversation_id:
            payload["conversation_id"] = conversation_id
        
        try:
            response = requests.post(
                f"{BASE_URL}/api/chat",
                headers={"Content-Type": "application/json"},
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                conversation_id = result["conversation_id"]
                print("✅ Chat request successful")
                print(f"Response: {result['response'][:100]}...")
                print(f"Conversation ID: {conversation_id}")
            else:
                print(f"❌ Chat request failed: {response.status_code}")
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Chat request error: {e}")

def test_conversations():
    """Test the conversations endpoint"""
    print("\nTesting conversations endpoint...")
    
    test_user = "test_user_1"
    
    try:
        response = requests.get(f"{BASE_URL}/api/conversations/{test_user}")
        
        if response.status_code == 200:
            conversations = response.json()
            print("✅ Conversations request successful")
            print(f"Found {len(conversations)} conversations for user {test_user}")
            
            for conv in conversations:
                print(f"  - Conversation {conv['id']}: {len(conv['messages'])} messages")
        else:
            print(f"❌ Conversations request failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Conversations request error: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting API tests...")
    print("Make sure the server is running on http://localhost:8000")
    print("=" * 50)
    
    # Wait a moment for server to be ready
    time.sleep(1)
    
    test_health()
    test_chat()
    test_conversations()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")

if __name__ == "__main__":
    main() 