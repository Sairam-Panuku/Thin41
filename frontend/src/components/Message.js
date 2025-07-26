import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in;
  
  ${props => props.isUser ? `
    justify-content: flex-end;
  ` : `
    justify-content: flex-start;
  `}
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.5rem;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  ` : `
    background: #f0f0f0;
    color: #666;
  `}
`;

const SenderName = styled.span`
  font-weight: 600;
  margin-right: 0.5rem;
`;

const Timestamp = styled.span`
  opacity: 0.7;
`;

const MessageContent = styled.div`
  font-size: 0.95rem;
  
  ${props => props.isUser ? `
    color: white;
  ` : `
    color: #333;
  `}
  
  p {
    margin: 0 0 0.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
  
  code {
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.2)' : '#f0f0f0'};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }
  
  pre {
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : '#f8f9fa'};
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5rem 0;
    
    code {
      background: none;
      padding: 0;
    }
  }
`;

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (content) => {
    // Simple formatting for better readability
    return content
      .split('\n')
      .map((line, index) => {
        if (line.trim() === '') return <br key={index} />;
        return <p key={index}>{line}</p>;
      });
  };

  return (
    <MessageContainer isUser={isUser}>
      {!isUser && (
        <Avatar isUser={isUser}>
          🤖
        </Avatar>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
        <MessageHeader>
          <SenderName>
            {isUser ? 'You' : 'AI Assistant'}
          </SenderName>
          <Timestamp>
            {formatTimestamp(message.timestamp)}
          </Timestamp>
        </MessageHeader>
        
        <MessageBubble isUser={isUser}>
          <MessageContent isUser={isUser}>
            {formatContent(message.content)}
          </MessageContent>
        </MessageBubble>
      </div>
      
      {isUser && (
        <Avatar isUser={isUser}>
          👤
        </Avatar>
      )}
    </MessageContainer>
  );
};

export default Message; 