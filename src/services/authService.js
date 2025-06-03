import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.loadAuthState();
  }

  loadAuthState() {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { isAuthenticated, user } = JSON.parse(authData);
      this.isAuthenticated = isAuthenticated;
      this.user = user;
    }
  }

  saveAuthState() {
    localStorage.setItem('auth', JSON.stringify({
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }));
  }

  async login(username, password) {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      this.isAuthenticated = true;
      this.user = res.data;
      this.saveAuthState();
      return { user: this.user };
    } catch (err) {
      throw new Error('Invalid credentials');
    }
  }

  async register(username, email, password) {
    try {
      const res = await axios.post(`${API_URL}/register`, { username, email, password });
      this.isAuthenticated = true;
      this.user = res.data;
      this.saveAuthState();
      return { user: this.user };
    } catch (err) {
      throw new Error('Registration failed');
    }
  }

  async logout() {
    this.isAuthenticated = false;
    this.user = null;
    localStorage.removeItem('auth');
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

export const authService = new AuthService();
