import React, { useEffect, useState } from 'react';
import ChatWindowContainer from '../components/ChatWindowContainer';

// This page renders the public chat window for all visitors (no login required)
const USER_CHAT_CONTEXT_KEY = 'user_custom_chat_context';

const PublicChatStandalone = () => {
  const [userContext, setUserContext] = useState('');
  useEffect(() => {
    // Use the same logic as the dashboard preview: get context from localStorage
    setUserContext(localStorage.getItem(USER_CHAT_CONTEXT_KEY) || '');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-3xl font-bold text-center mb-4">Chat with Swift Assist</h1>
        <p className="text-center text-gray-600 mb-8">Ask anything! This is a live AI chat preview for all visitors.</p>
        <ChatWindowContainer mode="user" contextOverride={userContext} />
      </div>
    </div>
  );
};

export default PublicChatStandalone;
