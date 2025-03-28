// This is a simple auth service. In production, you'd want to use proper authentication with a backend.
class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    // Load auth state from localStorage
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

  register(username, email) {
    // In production, this would make an API call to your backend
    return new Promise((resolve, reject) => {
      // Simulate successful registration
      this.isAuthenticated = true;
      this.user = { username, email, role: 'user' };
      this.saveAuthState();
      resolve({ user: this.user });
    });
  }

  login(username, password) {
    // In production, this would make an API call to your backend
    return new Promise((resolve, reject) => {
      // Simulated credentials - in production, this would be handled by your backend
      if (username === 'admin' && password === 'admin123') {
        this.isAuthenticated = true;
        this.user = { username, role: 'admin' };
        this.saveAuthState();
        resolve({ user: this.user });
      } else if (username === 'user' && password === 'user123') {
        this.isAuthenticated = true;
        this.user = { username, role: 'user' };
        this.saveAuthState();
        resolve({ user: this.user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  }

  logout() {
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

// Export singleton instance
export const authService = new AuthService();
