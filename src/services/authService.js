import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function handleApiError(error, defaultMsg) {
  if (error?.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  if (error?.message) {
    throw new Error(error.message);
  }
  throw new Error(defaultMsg);
}

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
    if (!username || !password) throw new Error('Username and password are required');
    try {
      // Fetch CSRF token first
      await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
      const res = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
      this.isAuthenticated = true;
      this.user = res.data;
      this.saveAuthState();
      return { user: this.user };
    } catch (err) {
      handleApiError(err, 'Invalid credentials');
    }
  }

  async register(username, email, password) {
    if (!username || !email || !password) throw new Error('All fields are required');
    try {
      const res = await axios.post(`${API_URL}/register`, { username, email, password });
      this.isAuthenticated = true;
      this.user = res.data;
      this.saveAuthState();
      return { user: this.user };
    } catch (err) {
      handleApiError(err, 'Registration failed');
    }
  }

  async logout() {
    this.isAuthenticated = false;
    this.user = null;
    localStorage.removeItem('auth');
    // Optionally, clear the cookie on the backend
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true }).catch(() => {});
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
