import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import CustomChatWindow from './CustomChatWindow';

const USER_CHAT_CONTEXT_KEY = 'user_custom_chat_context';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat-context');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [chatName, setChatName] = useState('');
  const [customLinkName, setCustomLinkName] = useState('');
  const [linkError, setLinkError] = useState('');
  const [userContext, setUserContext] = useState(localStorage.getItem(USER_CHAT_CONTEXT_KEY) || '');
  const [customLinks, setCustomLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [editLinkName, setEditLinkName] = useState('');
  const [editLinkContext, setEditLinkContext] = useState('');

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
          setCustomLinks(normalizedLinks);
        } catch (e) {
          setCustomLinks([]);
        }
      }
      setLoadingLinks(false);
    };
    fetchLinks();
  }, []);

  const generateLink = async () => {
    // Validate the custom link name
    if (!customLinkName.trim()) {
      setLinkError('Please enter a custom link name');
      return;
    }

    // Check if the custom link name contains only valid characters
    const validLinkRegex = /^[a-zA-Z0-9-_]+$/;
    if (!validLinkRegex.test(customLinkName)) {
      setLinkError('Link name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    // Clear any previous errors
    setLinkError('');

    // Create the link with the custom name
    const linkObj = {
      name: customLinkName,
      context: '',
      url: `${window.location.origin}/chat/${customLinkName}`
    };
    const updatedLinks = [...customLinks, linkObj];
    setGeneratedLink(linkObj.url);
    setLinkCopied(false);
    setCustomLinks(updatedLinks);

    // Save to backend
    const currentUser = authService.currentUserValue;
    if (currentUser && currentUser.id) {
      await userService.updateCustomLinks(currentUser.id, updatedLinks);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  const handleUserContextChange = (e) => {
    setUserContext(e.target.value);
    localStorage.setItem(USER_CHAT_CONTEXT_KEY, e.target.value);
    // Optionally, update all custom links' context if you want a default context
  };

  const handleSaveUserContext = async () => {
    localStorage.setItem(USER_CHAT_CONTEXT_KEY, userContext);
    // Optionally, update all custom links' context in the backend
    const currentUser = authService.currentUserValue;
    if (currentUser && currentUser.id) {
      const updatedLinks = customLinks.map(l => ({ ...l, context: userContext }));
      setCustomLinks(updatedLinks);
      await userService.updateCustomLinks(currentUser.id, updatedLinks);
    }
  };

  const handleEditLink = (index) => {
    setEditingLinkIndex(index);
    setEditLinkName(customLinks[index].name || '');
    setEditLinkContext(customLinks[index].context || '');
  };

  const handleCancelEditLink = () => {
    setEditingLinkIndex(null);
    setEditLinkName('');
    setEditLinkContext('');
  };

  const handleSaveEditLink = async () => {
    if (!editLinkName.trim()) return;
    const updatedLinks = [...customLinks];
    updatedLinks[editingLinkIndex] = {
      ...updatedLinks[editingLinkIndex],
      name: editLinkName,
      context: editLinkContext,
      url: `${window.location.origin}/chat/${editLinkName}`
    };
    setCustomLinks(updatedLinks);
    setEditingLinkIndex(null);
    setEditLinkName('');
    setEditLinkContext('');
    // Save to backend
    const currentUser = authService.currentUserValue;
    if (currentUser && currentUser.id) {
      await userService.updateCustomLinks(currentUser.id, updatedLinks);
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
              <CustomChatWindow />
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
      case 'create-link':
        return (
          <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Create a Public Chat Link</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Link Name <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 border-gray-300 rounded-l-lg">
                  {window.location.origin}/chat/
                </span>
                <input
                  type="text"
                  value={customLinkName}
                  onChange={e => setCustomLinkName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-custom-link-name"
                />
              </div>
              {linkError && <p className="mt-1 text-sm text-red-600">{linkError}</p>}
              <p className="mt-1 text-sm text-gray-500">Use only letters, numbers, hyphens, and underscores.</p>
            </div>
            <button
              onClick={generateLink}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              disabled={loadingLinks}
            >
              Generate Link
            </button>
            {generatedLink && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Your Custom Chat Link</h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 focus:outline-none"
                  >
                    {linkCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Share this link with anyone you want to access your custom chat.</p>
              </div>
            )}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Your Saved Links</h3>
              {loadingLinks ? (
                <div>Loading...</div>
              ) : (
                <ul className="list-disc pl-6">
                  {customLinks.map((l, i) => (
                    <li key={i} className="mb-1 flex items-center gap-2">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{l.url}</a>
                      <button onClick={() => handleEditLink(i)} className="text-xs text-gray-500 underline">Edit</button>
                    </li>
                  ))}
                  {customLinks.length === 0 && <li className="text-gray-500">No links created yet.</li>}
                </ul>
              )}
              {/* Edit link modal or inline form */}
              {editingLinkIndex !== null && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <label className="block text-sm font-medium mb-1">Link Name</label>
                  <input
                    type="text"
                    value={editLinkName}
                    onChange={e => setEditLinkName(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <label className="block text-sm font-medium mb-1">Context</label>
                  <textarea
                    value={editLinkContext}
                    onChange={e => setEditLinkContext(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-2"
                    rows={3}
                  />
                  <button onClick={handleSaveEditLink} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Save</button>
                  <button onClick={handleCancelEditLink} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'links':
        return (
          <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">My Links</h2>
            {loadingLinks ? (
              <div>Loading...</div>
            ) : (
              <ul className="list-disc pl-6">
                {customLinks.map((l, i) => (
                  <li key={i} className="mb-1 flex items-center gap-2">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{l.url}</a>
                    <span className="text-xs text-gray-500 ml-2">{l.name}</span>
                    <button onClick={() => handleEditLink(i)} className="text-xs text-gray-500 underline">Edit</button>
                  </li>
                ))}
                {customLinks.length === 0 && <li className="text-gray-500">No links created yet.</li>}
              </ul>
            )}
            {editingLinkIndex !== null && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <label className="block text-sm font-medium mb-1">Link Name</label>
                <input
                  type="text"
                  value={editLinkName}
                  onChange={e => setEditLinkName(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <label className="block text-sm font-medium mb-1">Context</label>
                <textarea
                  value={editLinkContext}
                  onChange={e => setEditLinkContext(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                  rows={3}
                />
                <button onClick={handleSaveEditLink} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Save</button>
                <button onClick={handleCancelEditLink} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            )}
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
            <button
              onClick={() => setActiveTab('create-link')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'create-link' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Create a Link
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                activeTab === 'links' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              My Links
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
