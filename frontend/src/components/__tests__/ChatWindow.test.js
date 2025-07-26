import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatWindow from '../ChatWindow';
import { ChatProvider } from '../../context/ChatContext';

// Mock the child components
jest.mock('../MessageList', () => {
  return function MockMessageList() {
    return <div data-testid="message-list">Message List</div>;
  };
});

jest.mock('../UserInput', () => {
  return function MockUserInput() {
    return <div data-testid="user-input">User Input</div>;
  };
});

jest.mock('../ConversationHistory', () => {
  return function MockConversationHistory({ isOpen, onToggle }) {
    return (
      <div data-testid="conversation-history" onClick={onToggle}>
        Conversation History {isOpen ? 'Open' : 'Closed'}
      </div>
    );
  };
});

describe('ChatWindow', () => {
  it('renders without crashing', () => {
    render(
      <ChatProvider>
        <ChatWindow />
      </ChatProvider>
    );
    
    expect(screen.getByTestId('message-list')).toBeInTheDocument();
    expect(screen.getByTestId('user-input')).toBeInTheDocument();
    expect(screen.getByTestId('conversation-history')).toBeInTheDocument();
  });

  it('displays chat title', () => {
    render(
      <ChatProvider>
        <ChatWindow />
      </ChatProvider>
    );
    
    expect(screen.getByText('💬 Chat with AI Assistant')).toBeInTheDocument();
  });

  it('shows AI online status', () => {
    render(
      <ChatProvider>
        <ChatWindow />
      </ChatProvider>
    );
    
    expect(screen.getByText('AI Online')).toBeInTheDocument();
  });
}); 