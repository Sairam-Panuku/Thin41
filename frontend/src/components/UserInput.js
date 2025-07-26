import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatContext';

const InputContainer = styled.div`
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
`;

const InputForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 22px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SendIcon = styled.span`
  transform: translateX(1px);
`;

const CharacterCount = styled.div`
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 0.75rem;
  color: #999;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    border-color: #667eea;
    color: #667eea;
  }
`;

const UserInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const { sendMessage, isLoading } = useChat();

  const quickActions = [
    "What products do you have?",
    "Show me the latest orders",
    "What are your best sellers?",
    "Help me find a product",
    "What's the total revenue?",
    "How many customers do you have?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendMessage(inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + 'px';
    }
  }, [inputValue]);

  const isDisabled = isLoading || isSubmitting || !inputValue.trim();

  return (
    <InputContainer>
      <InputForm onSubmit={handleSubmit}>
        <InputWrapper>
          <TextArea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading || isSubmitting}
            rows={1}
          />
          {inputValue.length > 0 && (
            <CharacterCount>
              {inputValue.length} characters
            </CharacterCount>
          )}
        </InputWrapper>
        
        <SendButton 
          type="submit" 
          disabled={isDisabled}
          title="Send message"
        >
          <SendIcon>➤</SendIcon>
        </SendButton>
      </InputForm>
      
      <QuickActions>
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={index}
            type="button"
            onClick={() => handleQuickAction(action)}
            disabled={isLoading || isSubmitting}
          >
            {action}
          </QuickActionButton>
        ))}
      </QuickActions>
    </InputContainer>
  );
};

export default UserInput; 