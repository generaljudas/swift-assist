import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import GoogleOAuthButton from './GoogleOAuthButton';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email !== confirmEmail) {
      setError('Emails do not match');
      return;
    }

    try {
      await authService.register(username, email, password);
      // User will be created in Supabase via the register method
      // but we also want to add the user to our userService for additional metadata
      userService.addUser({
        name: username,
        email: email,
        company: 'New User',
        botLinks: [],
        location: '',
        businessType: 'Individual'
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Sign Up failed. Please try again.');
    }
  };

  const handleGoogleSuccess = () => {
    // Google OAuth flow will redirect user to Google and back
    // The actual state change will happen in the auth callback route
    console.log('Google authentication initiated');
  };

  const handleGoogleError = (error) => {
    setError('Google sign up failed. Please try again.');
    console.error('Google sign up error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center relative">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-8">
            Sign Up
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">
                Confirm Email
              </label>
              <div className="mt-1">
                <input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
              
              <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4">
                <GoogleOAuthButton 
                  className="w-full" 
                  onSuccess={handleGoogleSuccess} 
                  onError={handleGoogleError}
                />
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute bottom-8 w-full text-center">
        <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
