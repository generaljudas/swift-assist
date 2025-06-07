import React, { useEffect, useState, useRef } from 'react';
import ChatWindow from './ChatWindow';
import { chatService } from '../services/chatService';
import { settingsService } from '../services/settingsService';
import { authService } from '../services/authService';
import axios from 'axios';
import { API_URL } from '../services/userService';

// mode: 'admin' | 'user'
// Accept contextOverride for public chat
const ChatWindowContainer = ({ mode = 'admin', contextOverride }) => {
  const [context, setContext] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch context from backend
  useEffect(() => {
    if (contextOverride !== undefined) {
      setContext(contextOverride);
      setMessages([
        { role: 'assistant', content: contextOverride ? contextOverride.split(/[.!?]/)[0] : 'Hello! How can I help you today?' }
      ]);
      return;
    }
    const fetchContext = async () => {
      try {
        let ctx = '';
        if (mode === 'admin') {
          // Fetch admin context from public endpoint (no auth required)
          const res = await axios.get(`${API_URL}/public/admin-context`);
          ctx = res.data?.chat_context || '';
        } else {
          // Fetch current user context
          const user = authService.getUser();
          if (user && user.id) {
            const res = await axios.get(`${API_URL}/users/${user.id}`, { withCredentials: true });
            ctx = res.data?.chat_context || '';
          }
        }
        setContext(ctx);
        setMessages([
          { role: 'assistant', content: ctx ? ctx.split(/[.!?]/)[0] : 'Hello! How can I help you today?' }
        ]);
      } catch (err) {
        setContext('');
        setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
      }
    };
    fetchContext();
  }, [mode, contextOverride]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      if (context && context.trim()) {
        conversationHistory.unshift({ role: 'system', content: context });
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
    <ChatWindow
      messages={messages}
      inputMessage={inputMessage}
      isLoading={isLoading}
      onInputChange={e => setInputMessage(e.target.value)}
      onSend={handleSendMessage}
      inputRef={inputRef}
      messagesEndRef={messagesEndRef}
    />
  );
};

export default ChatWindowContainer;
