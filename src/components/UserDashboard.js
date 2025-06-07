import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import ChatWindowContainer from './ChatWindowContainer';

// USER_CHAT_CONTEXT_KEY and all localStorage usage for context are now obsolete and can be removed.
const USER_CHAT_CONTEXT_KEY = 'user_custom_chat_context';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat-context');
  const [userContext, setUserContext] = useState(localStorage.getItem(USER_CHAT_CONTEXT_KEY) || '');
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [customLinks, setCustomLinks] = useState([]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    // Load custom links from backend on mount
    const fetchLinks = async () => {
      const currentUser = authService.currentUserValue;
      if (currentUser && currentUser.id) {
        try {
          const links = await userService.getCustomLinks(currentUser.id);
          // Ensure each link is an object with name, context, and url
          const normalizedLinks = (links || []).map(l =>
            typeof l === 'string'
              ? { name: l, context: '', url: `${window.location.origin}/chat/${l}` }
              : { ...l, url: `${window.location.origin}/chat/${l.name || l.url?.split('/').pop()}` }
          );
        } catch (e) {
          setCustomLinks([]);
        }
      }
      setLoadingLinks(false);
    };
    fetchLinks();
  }, []);

  const handleUserContextChange = (e) => {
    setUserContext(e.target.value);
    localStorage.setItem(USER_CHAT_CONTEXT_KEY, e.target.value);
    // Optionally, update all custom links' context if you want a default context
  };

  const handleSaveUserContext = async () => {
    const currentUser = authService.getUser();
    if (currentUser && currentUser.id) {
      try {
        await userService.updateChatContext(currentUser.id, userContext);
        alert('Context saved!');
      } catch (e) {
        alert('Failed to save context: ' + (e.message || e));
      }
    } else {
      alert('Not logged in.');
    }
  };

  // Add a helper to get context for a link name
  const getContextForLink = (name) => {
    const link = customLinks.find(l => l.name === name);
    return link ? link.context : '';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat-context':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chat Context</h2>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter context for the chat AI"
              value={userContext}
              onChange={handleUserContextChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              This context will guide how the AI responds to your questions in the Preview Chat tab.
            </p>
            <button onClick={handleSaveUserContext} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Context
            </button>
          </div>
        );
      case 'add-tokens':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Tokens</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-lg font-medium">Current Balance: 100 tokens</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <p className="text-lg font-medium">{amount} Tokens</p>
                    <p className="text-sm text-gray-500">${(amount * 0.01).toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'customize':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preview Chat</h2>
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Live Custom Chat Preview</h3>
              <ChatWindowContainer
                mode="user"
                contextOverride={userContext}
              />
            </div>
          </div>
        );
      case 'instructions':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Getting Started</h3>
                <p className="text-blue-700">
                  Welcome to our customizable chat! This guide will help you make the most of our chat features.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">How to Use Chat Context</h3>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="mb-2">The Chat Context feature allows you to customize how the AI responds to your queries:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Navigate to the <strong>Chat Context</strong> tab</li>
                    <li>Enter specific information about your business, preferences, or requirements</li>
                    <li>Click <strong>Save Context</strong> to apply your changes</li>
                    <li>The AI will now use this context to provide more relevant responses</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Managing Your Tokens</h3>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="mb-2">Tokens are used to power your chat interactions:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Check your current token balance in the <strong>Add Tokens</strong> tab</li>
                    <li>Purchase additional tokens as needed</li>
                    <li>Each message exchange consumes a small number of tokens</li>
                    <li>You'll receive notifications when your balance is running low</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customizing Your Chat Experience</h3>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="mb-2">Personalize your chat interface in the <strong>Customize Chat</strong> tab:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Choose between light, dark, or system theme</li>
                    <li>Enable or disable message sounds</li>
                    <li>Adjust other preferences to suit your needs</li>
                    <li>Click <strong>Save Preferences</strong> to apply your changes</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Tips for Better Results</h3>
                <ul className="list-disc list-inside space-y-2 text-yellow-700">
                  <li>Be specific in your questions to get more accurate responses</li>
                  <li>Update your chat context regularly to reflect changes in your needs</li>
                  <li>Use the chat history to reference previous conversations</li>
                  <li>Provide feedback to help us improve the service</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveTab('chat-context')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'chat-context' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Chat Context
            </button>
            <button
              onClick={() => setActiveTab('add-tokens')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'add-tokens' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Add Tokens
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'customize' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Preview Chat
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'instructions' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Instructions
            </button>
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
