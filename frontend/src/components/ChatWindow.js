import React, { useState } from 'react';
import styled from 'styled-components';
import MessageList from './MessageList';
import UserInput from './UserInput';
import ConversationHistory from './ConversationHistory';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  padding-top: 80px; /* Account for fixed header */
`;

const MainChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ChatStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? '#4CAF50' : '#f44336'};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const WelcomeTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  padding-left: 1.5rem;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const ChatWindow = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChatContainer>
      <ConversationHistory 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <MainChatArea>
        <ChatHeader>
          <ChatTitle>💬 Chat with AI Assistant</ChatTitle>
          <ChatStatus>
            <StatusDot online={true} />
            <span>AI Online</span>
          </ChatStatus>
        </ChatHeader>

        <MessagesContainer>
          <MessageList />
        </MessagesContainer>

        <InputContainer>
          <UserInput />
        </InputContainer>
      </MainChatArea>
    </ChatContainer>
  );
};

export default ChatWindow; 