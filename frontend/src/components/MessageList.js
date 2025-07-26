import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Message from './Message';
import { useChat } from '../context/ChatContext';

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
`;

const WelcomeContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const WelcomeTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const WelcomeText = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const FeatureList = styled.ul`
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  padding-left: 1.5rem;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.8rem;
  color: #555;
  font-size: 0.95rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoadingText = styled.span`
  margin-left: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.9rem;
  color: #bbb;
`;

const MessageList = () => {
  const { messages, isLoading, currentConversation } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show welcome message if no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <MessagesContainer>
        <WelcomeContainer>
          <WelcomeTitle>👋 Welcome to E-commerce AI Assistant!</WelcomeTitle>
          <WelcomeText>
            I'm here to help you with all your shopping needs. Ask me anything about:
          </WelcomeText>
          <FeatureList>
            <FeatureItem>🔍 Product recommendations and searches</FeatureItem>
            <FeatureItem>📦 Order status and tracking</FeatureItem>
            <FeatureItem>💰 Pricing and availability</FeatureItem>
            <FeatureItem>🛒 Shopping cart assistance</FeatureItem>
            <FeatureItem>📊 Sales and analytics</FeatureItem>
            <FeatureItem>👥 Customer support</FeatureItem>
          </FeatureList>
          <WelcomeText>
            Just type your question below and I'll help you find what you're looking for!
          </WelcomeText>
        </WelcomeContainer>
      </MessagesContainer>
    );
  }

  // Show loading state
  if (isLoading && messages.length === 0) {
    return (
      <MessagesContainer>
        <LoadingContainer>
          <div className="spinner"></div>
          <LoadingText>AI is thinking...</LoadingText>
        </LoadingContainer>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer>
      {messages.map((message, index) => (
        <Message 
          key={message.id || index} 
          message={message} 
          className="fade-in"
        />
      ))}
      
      {isLoading && (
        <LoadingContainer>
          <div className="spinner"></div>
          <LoadingText>AI is typing...</LoadingText>
        </LoadingContainer>
      )}
      
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default MessageList; 