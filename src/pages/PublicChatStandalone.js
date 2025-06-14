import React, { useEffect, useState } from 'react';
import ChatWindowContainer from '../components/ChatWindowContainer';

// This page renders the public chat window for all visitors (no login required)
const USER_CHAT_CONTEXT_KEY = 'user_custom_chat_context';

const PublicChatStandalone = () => {
  const [userContext, setUserContext] = useState('');
  const [publicChatHeader, setPublicChatHeader] = useState('');
  const [publicChatSubheader, setPublicChatSubheader] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch context and headers from backend public endpoint for the logged-in user
    const fetchContext = async () => {
      let username = 'user';
      try {
        // Try to get the logged-in user from authService
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.user && parsed.user.username) {
            username = parsed.user.username;
          }
        }
        const res = await fetch(`http://localhost:5000/api/public/user-context/${username}`);
        const data = await res.json();
        setUserContext(data.chat_context || '');
        setPublicChatHeader(data.public_chat_header || 'Chat with Swift Assist');
        setPublicChatSubheader(data.public_chat_subheader || 'Ask anything! This is a live AI chat preview for all visitors.');
      } catch {
        setUserContext('');
        setPublicChatHeader('default values loaded, header fetch failed');
        setPublicChatSubheader('default values loaded, subheader fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl p-4">
          <h1 className="text-3xl font-bold text-center mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-3xl font-bold text-center mb-4">{publicChatHeader}</h1>
        <p className="text-center text-gray-600 mb-8">{publicChatSubheader}</p>
        <ChatWindowContainer mode="user" contextOverride={userContext} />
      </div>
    </div>
  );
};

export default PublicChatStandalone;
