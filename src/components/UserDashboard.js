import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat-context');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
            />
            <p className="mt-2 text-sm text-gray-500">
              This context will guide how the AI responds to your questions.
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <h2 className="text-xl font-semibold mb-4">Customize Chat</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chat Theme
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Sound
                </label>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2">Enable message sounds</span>
                </div>
              </div>
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Save Preferences
              </button>
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
              Customize Chat
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
