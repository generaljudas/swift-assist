import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { userService, API_URL } from '../services/userService';
import Users from './Users';
import SettingsForm from './SettingsForm';
import ChatWindowContainer from './ChatWindowContainer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [adminContext, setAdminContext] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());

  useEffect(() => {
    // Always fetch admin context from public endpoint for preview and settings
    const fetchAdminContext = async () => {
      try {
        const res = await fetch(`${API_URL}/public/admin-context`);
        if (!res.ok) throw new Error('Failed to fetch admin context');
        const data = await res.json();
        setAdminContext(data.chat_context || '');
      } catch {
        setAdminContext('');
      }
    };
    fetchAdminContext();
    // Check if admin is logged in
    setIsAdmin(authService.isAdmin());
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    if (!isAdmin) {
      setSaveStatus('You must be logged in as admin to update the context.');
      return;
    }
    try {
      if (apiKey.trim()) {
        settingsService.setApiKey(apiKey.trim());
      }
      if (adminContext.trim()) {
        // Fetch CSRF token first
        const csrfRes = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        const csrfData = await csrfRes.json();
        const csrfToken = csrfData.csrfToken;
        // Save to database for admin user using protected endpoint (requires admin login)
        const res = await fetch(`${API_URL}/admin/context`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          credentials: 'include',
          body: JSON.stringify({ chat_context: adminContext.trim() })
        });
        if (!res.ok) throw new Error('Failed to update admin context');
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

  const navItems = [
    // Removed 'Dashboard' and 'Admin Tools' tabs
    { name: 'Users', path: '/admin/users' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Alerts', path: '/admin/alerts' },
    { name: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 ${activeTab === 'preview' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
              >
                Preview Chat
              </button>
            </li>
            {/* Keep other nav items as NavLinks for routing */}
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'settings' && (
          <SettingsForm
            apiKey={apiKey}
            setApiKey={setApiKey}
            adminContext={adminContext}
            setAdminContext={setAdminContext}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            saveStatus={saveStatus}
            handleSave={handleSave}
          />
        )}
        {activeTab === 'preview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preview Chat</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Current Admin Chat Context</label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={adminContext}
                readOnly
              />
              <p className="mt-2 text-sm text-gray-500">
                This is the context currently set for the admin chat. To edit, go to the Settings tab.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Live Admin Chat Preview</h3>
              <ChatWindowContainer mode="admin" contextOverride={adminContext} />
            </div>
          </div>
        )}
        {/* Keep the old <Routes> for legacy routing, but hide if using tab UI */}
        {/* <Routes> ... </Routes> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
