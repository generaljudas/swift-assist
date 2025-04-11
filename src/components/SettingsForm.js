import React from 'react';

const SettingsForm = ({
  apiKey,
  setApiKey,
  adminContext,
  setAdminContext,
  showApiKey,
  setShowApiKey,
  saveStatus,
  handleSave
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
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
  );
};

export default SettingsForm;
