import React from 'react';
import CustomChatWindow from '../components/CustomChatWindow';

// This page renders only the CustomChatWindow, using the user's custom chat context from localStorage
const PublicChatPage = () => {
  // Optionally, you could get the context from the URL or other source
  // For now, CustomChatWindow will use the context from localStorage (user_custom_chat_context)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <CustomChatWindow />
    </div>
  );
};

export default PublicChatPage;
