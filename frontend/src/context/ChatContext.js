import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Action types
const ACTIONS = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_CURRENT_CONVERSATION: 'SET_CURRENT_CONVERSATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER_ID: 'SET_USER_ID'
};

// Initial state
const initialState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
  userId: 'user_' + Math.random().toString(36).substr(2, 9) // Generate random user ID
};

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ACTIONS.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload
      };
    
    case ACTIONS.SET_CURRENT_CONVERSATION:
      return {
        ...state,
        currentConversation: action.payload
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ACTIONS.SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [state.userId]);

  // API functions
  const api = {
    // Send a message to the AI
    sendMessage: async (message, conversationId = null) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.CLEAR_ERROR });

        const response = await axios.post(`${API_BASE_URL}/api/chat`, {
          message,
          user_id: state.userId,
          conversation_id: conversationId
        });

        return response.data;
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = error.response?.data?.detail || 'Failed to send message';
        dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Load conversations for the current user
    loadConversations: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/conversations/${state.userId}`);
        return response.data;
      } catch (error) {
        console.error('Error loading conversations:', error);
        return [];
      }
    },

    // Load messages for a specific conversation
    loadConversationMessages: async (conversationId) => {
      try {
        const conversations = await api.loadConversations();
        const conversation = conversations.find(conv => conv.id === conversationId);
        return conversation ? conversation.messages : [];
      } catch (error) {
        console.error('Error loading conversation messages:', error);
        return [];
      }
    }
  };

  // Context functions
  const sendMessage = async (message) => {
    try {
      // Add user message to state immediately
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: userMessage });

      // Send to API
      const response = await api.sendMessage(message, state.currentConversation?.id);
      
      // Add AI response to state
      const aiMessage = {
        id: response.message_id,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: aiMessage });

      // Update current conversation
      if (response.conversation_id) {
        dispatch({ 
          type: ACTIONS.SET_CURRENT_CONVERSATION, 
          payload: response.conversation_id 
        });
      }

      // Reload conversations to get updated list
      await loadConversations();

    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: errorMessage });
    }
  };

  const loadConversations = async () => {
    try {
      const conversations = await api.loadConversations();
      dispatch({ type: ACTIONS.SET_CONVERSATIONS, payload: conversations });
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const messages = await api.loadConversationMessages(conversationId);
      dispatch({ type: ACTIONS.SET_MESSAGES, payload: messages });
      dispatch({ type: ACTIONS.SET_CURRENT_CONVERSATION, payload: conversationId });
      
    } catch (error) {
      console.error('Error loading conversation:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load conversation' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const startNewConversation = () => {
    dispatch({ type: ACTIONS.SET_MESSAGES, payload: [] });
    dispatch({ type: ACTIONS.SET_CURRENT_CONVERSATION, payload: null });
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const setUserId = (userId) => {
    dispatch({ type: ACTIONS.SET_USER_ID, payload: userId });
  };

  // Context value
  const value = {
    // State
    messages: state.messages,
    conversations: state.conversations,
    currentConversation: state.currentConversation,
    isLoading: state.isLoading,
    error: state.error,
    userId: state.userId,

    // Actions
    sendMessage,
    loadConversations,
    loadConversation,
    startNewConversation,
    clearError,
    setUserId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 