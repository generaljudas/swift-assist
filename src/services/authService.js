import logger from '../utils/logger';
// Authentication service using Supabase
import { supabase } from '../utils/supabaseClient';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    // Load auth state from localStorage and check Supabase session
    this.loadAuthState();
  }

  async loadAuthState() {
    try {
      // Check local storage first for backward compatibility
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { isAuthenticated, user } = JSON.parse(authData);
        this.isAuthenticated = isAuthenticated;
        this.user = user;
      }

      // Check Supabase session (takes precedence over localStorage)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.isAuthenticated = true;
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          this.user = {
            id: userData.user.id,
            email: userData.user.email,
            username: userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
            role: userData.user.user_metadata?.role || 'user',
            ...userData.user.user_metadata
          };
          this.saveAuthState();
        }
      }
    } catch (error) {
      logger.error('Error loading auth state:', error);
    }
  }

  saveAuthState() {
    localStorage.setItem('auth', JSON.stringify({
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }));
  }

  async register(username, email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: username,
            role: 'user'
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        this.isAuthenticated = true;
        this.user = {
          id: data.user.id,
          email: data.user.email,
          username: username,
          role: 'user'
        };
        this.saveAuthState();
        return { user: this.user };
      }
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        this.isAuthenticated = true;
        this.user = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: data.user.user_metadata?.role || 'user',
          ...data.user.user_metadata
        };
        this.saveAuthState();
        return { user: this.user };
      }
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;
      
      // The user will be redirected to Google for authentication
      return data;
    } catch (error) {
      logger.error('Google sign-in error:', error);
      throw error;
    }
  }

  async handleAuthCallback() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data?.session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          this.isAuthenticated = true;
          this.user = {
            id: userData.user.id,
            email: userData.user.email,
            username: userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
            role: userData.user.user_metadata?.role || 'user',
            ...userData.user.user_metadata
          };
          this.saveAuthState();
          return { user: this.user };
        }
      }
    } catch (error) {
      logger.error('Auth callback error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('auth');
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  isAdmin() {
    return this.user?.role === 'admin';
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}

// Export singleton instance
export const authService = new AuthService();
