import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const user = authService.getUser();
    const storedApiKey = settingsService.getApiKey();
    const storedContext = settingsService.getContextForUser(user);

    if (storedApiKey) {
      chatService.setApiKey(storedApiKey);
      
      // Add a greeting message when the chat loads
      setMessages([{
        role: 'assistant',
        content: 'Hello! Welcome to Swift Assist. How can I help you today?'
      }]);
    } else if (!authService.isAdmin()) {
      // For non-admin users, show an error message when API key is not set
      setMessages([{
        role: 'assistant',
        content: 'Chat is currently unavailable. Please try again later or contact support.'
      }]);
    } else {
      // For admin users without API key, still show a greeting
      setMessages([{
        role: 'assistant',
        content: 'Welcome, admin! Please set up your API key in the settings to enable the chat functionality.'
      }]);
    }

    setContext(storedContext);
  }, [navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
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
      
      // If we have a custom context set by the user, override the default system context
      if (context && context.trim()) {
        // Insert the custom context at the beginning of the conversation history
        conversationHistory.unshift({ role: 'system', content: context });
      }

      const response = await chatService.sendMessage(inputMessage, conversationHistory);
      
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
            to="/register"
            className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* AnimatedText at the top */}
      <AnimatedText />

      {/* Chat interface below */}
      <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 mt-16 mb-24">
        <div 
          ref={chatContainerRef}
          className="w-full max-w-3xl bg-gray-50 rounded-lg shadow-xl overflow-hidden mx-auto"
        >
          {/* Messages container */}
          <div className="h-[500px] sm:h-[550px] lg:h-[600px] overflow-y-auto p-4 sm:p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question about our services..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
