import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { authService } from './services/authService';

// Protected route wrapper for admin-only routes
const AdminRoute = ({ children }) => {
  const location = useLocation();
  
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authService.isAdmin()) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

// Protected route wrapper for authenticated users
const AuthRoute = ({ children }) => {
  const location = useLocation();
  
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Navigation header with dynamic links based on auth state
const Navigation = () => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();

  return (
    <>
      <div className="fixed top-4 left-4">
        <a
          href="#"
          className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
        >
          Contact
        </a>
      </div>
      <div className="fixed top-4 right-4 flex space-x-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/';
              }}
              className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
        )}
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col justify-center relative">
            <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden">
              <video 
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                className="absolute inset-0 w-full h-full object-cover pointer-events-none
                  transition-transform duration-300 ease-in-out
                  [@media(min-aspect-ratio:16/9)]:scale-[1.2]
                  [@media(min-aspect-ratio:16/9)]:-translate-y-[10%]
                  [@media(max-aspect-ratio:16/9)]:scale-[1.1]
                  [@media(max-aspect-ratio:16/9)]:-translate-y-[5%]"
              >
                <source src="/background.mp4?v=15" type="video/mp4" />
              </video>
            </div>
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                AI-Powered Customer Support
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Provide instant, 24/7 support to your customers with Swift Assist.
              </p>
              <div className="mt-8">
                <Link
                  to="/chat"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={
          <AuthRoute>
            <UserDashboard />
          </AuthRoute>
        } />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/customer-context" 
          element={
            <AuthRoute>
              <Chat showContextEditor={true} />
            </AuthRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
