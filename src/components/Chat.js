import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import ChatWindowContainer from './ChatWindowContainer';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Add this effect to focus the input when messages change
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Remove all local context logic, let ChatWindowContainer handle fetching from backend
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    const currentInputMessage = inputMessage;
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history - only include previous messages, not the system context
      // The chatService will add the system context internally
      const conversationHistory = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      const response = await chatService.sendMessage(currentInputMessage, conversationHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      
      // Display a more specific error message based on the error type
      let errorMessage = 'Sorry, I encountered an error. Please try again or contact support if the issue persists.';
      
      if (error.message.includes('API key')) {
        errorMessage = 'API key error: Please check your API key in settings.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded: Please try again in a few moments.';
      } else if (error.message.includes('OpenAI API error')) {
        errorMessage = error.message;
      }
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
      
      // Try multiple approaches to ensure focus returns to input
      if (inputRef.current) {
        // Immediate attempt
        inputRef.current.focus();
        
        // Delayed attempt with setTimeout
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }
    }
  };

  return (
    <div className="flex flex-col relative bg-slate-300 min-h-screen">
      {/* Navigation header with consistent positioning */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
        <div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
          >
            Home
          </button>
        </div>
        <div>
          <Link
            to="/login"
            className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
        </div>
      </div>

      {/* AnimatedText at the top */}
      <AnimatedText />

      {/* Chat interface below */}
      <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 mt-16 mb-24">
        <ChatWindowContainer mode="admin" />
      </div>
    </div>
  );
};

export default Chat;
