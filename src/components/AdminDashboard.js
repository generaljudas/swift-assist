import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import Users from './Users';
import SettingsForm from './SettingsForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [adminContext, setAdminContext] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/login');
      return;
    }

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

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Alerts', path: '/admin/alerts' },
    { name: 'Admin Tools', path: '/admin/tools' },
    { name: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="p-2" aria-label="Admin navigation">
          <ul className="space-y-1">
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
        <Routes>
          <Route path="settings" element={
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
          } />
          <Route path="users" element={<Users />} />
          <Route path="*" element={
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
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
