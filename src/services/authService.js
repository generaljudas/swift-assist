// Authentication service (Supabase removed)

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

  async register(username, email, password) {
    // Implement your own registration logic here (Supabase removed)
    this.isAuthenticated = true;
    this.user = { id: Date.now(), email, username, role: 'user' };
    this.saveAuthState();
    return { user: this.user };
  }

  async login(email, password) {
    // Implement your own login logic here (Supabase removed)
    if ((email === 'admin' && password === 'admin123') || (email === 'user' && password === 'user123')) {
      this.isAuthenticated = true;
      this.user = { username: email, email: `${email}@example.com`, role: email === 'admin' ? 'admin' : 'user' };
      this.saveAuthState();
      return { user: this.user };
    }
    // Fallback: check localStorage or custom logic
    throw new Error('Login failed. Supabase removed.');
  }

  async signInWithGoogle() {
    // Google OAuth removed (Supabase removed)
    throw new Error('Google sign-in not supported. Supabase removed.');
  }

  async handleAuthCallback() {
    // No-op (Supabase removed)
    return null;
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
