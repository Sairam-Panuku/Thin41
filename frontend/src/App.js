import React from 'react';
import styled from 'styled-components';
import ChatWindow from './components/ChatWindow';
import { ChatProvider } from './context/ChatContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const AppHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const AppTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const AppSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
`;

function App() {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <AppContainer>
          <AppHeader>
            <AppTitle>🛒 E-commerce AI Agent</AppTitle>
            <AppSubtitle>Your intelligent shopping assistant</AppSubtitle>
          </AppHeader>
          <ChatWindow />
        </AppContainer>
      </ChatProvider>
    </ErrorBoundary>
  );
}

export default App; 