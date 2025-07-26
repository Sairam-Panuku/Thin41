import React from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatContext';

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '300px' : '0'};
  background: white;
  border-right: 1px solid #e0e0e0;
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewChatButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.75rem;
  width: 100%;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ConversationItem = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
  border: 1px solid transparent;
  
  ${props => props.isActive ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  ` : `
    background: #f8f9fa;
    color: #333;
    
    &:hover {
      background: #e9ecef;
      border-color: #dee2e6;
    }
  `}
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ConversationTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.3;
  flex: 1;
`;

const ConversationDate = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
  margin-left: 0.5rem;
`;

const ConversationPreview = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ConversationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
`;

const MessageCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.8rem;
  color: #bbb;
`;

const ToggleButton = styled.button`
  position: fixed;
  left: ${props => props.isOpen ? '300px' : '20px'};
  top: 100px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  &:hover {
    background: #f8f9fa;
    transform: scale(1.05);
  }
`;

const ConversationHistory = ({ isOpen, onToggle }) => {
  const { 
    conversations, 
    currentConversation, 
    loadConversation, 
    startNewConversation,
    isLoading 
  } = useChat();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConversationTitle = (conversation) => {
    const firstMessage = conversation.messages[0];
    if (firstMessage) {
      const content = firstMessage.content;
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'New conversation';
  };

  const getConversationPreview = (conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const content = lastMessage.content;
      return content.length > 80 ? content.substring(0, 80) + '...' : content;
    }
    return 'No messages yet';
  };

  const handleConversationClick = (conversationId) => {
    if (conversationId !== currentConversation) {
      loadConversation(conversationId);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
  };

  return (
    <>
      <Sidebar isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>
            💬 Conversations
          </SidebarTitle>
          <NewChatButton onClick={handleNewChat} disabled={isLoading}>
            + New Chat
          </NewChatButton>
        </SidebarHeader>

        <ConversationsList>
          {conversations.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💭</EmptyIcon>
              <EmptyText>No conversations yet</EmptyText>
              <EmptySubtext>Start a new chat to begin</EmptySubtext>
            </EmptyState>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                isActive={conversation.id === currentConversation}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <ConversationHeader>
                  <ConversationTitle>
                    {getConversationTitle(conversation)}
                  </ConversationTitle>
                  <ConversationDate>
                    {formatDate(conversation.updated_at)}
                  </ConversationDate>
                </ConversationHeader>
                
                <ConversationPreview>
                  {getConversationPreview(conversation)}
                </ConversationPreview>
                
                <ConversationMeta>
                  <MessageCount>
                    💬 {conversation.messages.length} messages
                  </MessageCount>
                  <span>{formatTime(conversation.updated_at)}</span>
                </ConversationMeta>
              </ConversationItem>
            ))
          )}
        </ConversationsList>
      </Sidebar>

      <ToggleButton isOpen={isOpen} onClick={onToggle}>
        {isOpen ? '◀' : '▶'}
      </ToggleButton>
    </>
  );
};

export default ConversationHistory; 