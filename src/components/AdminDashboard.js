import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [adminContext, setAdminContext] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!authService.isAdmin()) {
      navigate('/login');
      return;
    }

    // Load current settings
    setApiKey(settingsService.getApiKey() || '');
    setAdminContext(settingsService.getAdminContext() || '');
  }, [navigate]);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (apiKey.trim()) {
        settingsService.setApiKey(apiKey.trim());
      }
      if (adminContext.trim()) {
        settingsService.setAdminContext(adminContext.trim());
      }
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings: ' + error.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* API Key Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your OpenAI API key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Context Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat Context
              </label>
              <textarea
                value={adminContext}
                onChange={(e) => setAdminContext(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the default context for the chat AI"
              />
              <p className="mt-1 text-sm text-gray-500">
                This context will be used to guide the AI's responses about your services.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
              {saveStatus && (
                <p className={`text-sm ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveStatus}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
