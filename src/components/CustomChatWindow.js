import React, { useRef, useState } from 'react';
import ChatWindow from './ChatWindow';
import { chatService } from '../services/chatService';
import { settingsService } from '../services/settingsService';

// This is a fully isolated chat window for the dashboard preview, with its own context
const getGreetingFromContext = (context) => {
  if (!context || !context.trim()) return 'Hello! How can I help you today?';
  // Use the first sentence or up to 120 chars as a greeting
  const firstSentence = context.split(/[.!?]/)[0];
  return firstSentence.length > 10 ? firstSentence.trim() : 'Hello! How can I help you today?';
};

const CustomChatWindow = ({ initialContext = '', theme = 'light' }) => {
  // Get user context from localStorage or prop
  const userContext = (typeof window !== 'undefined' && localStorage.getItem('user_custom_chat_context')) || initialContext || '';
  const [messages, setMessages] = useState([
    { role: 'assistant', content: getGreetingFromContext(userContext) }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      // Always use the user's preview chat context from localStorage
      const userContext = localStorage.getItem('user_custom_chat_context') || '';
      if (userContext && userContext.trim()) {
        conversationHistory.unshift({ role: 'system', content: userContext });
      }
      const apiKey = settingsService.getApiKey();
      if (apiKey) chatService.setApiKey(apiKey);
      const response = await chatService.sendMessage(userMessage.content, conversationHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + (error.message || 'Unknown error') }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  };

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} style={{ minHeight: 400 }}>
      <ChatWindow
        messages={messages}
        inputMessage={inputMessage}
        isLoading={isLoading}
        onInputChange={e => setInputMessage(e.target.value)}
        onSend={handleSendMessage}
        inputRef={inputRef}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default CustomChatWindow;
