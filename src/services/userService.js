const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function handleApiError(error, defaultMsg) {
  if (error && error.message) {
    throw new Error(error.message);
  }
  throw new Error(defaultMsg);
}

class UserService {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      // Map to include username, email, role, created_at
      return data.map(user => ({
        id: user.id,
        username: user.username || user.name,
        email: user.email,
        role: user.role || 'user',
        created_at: user.created_at
      }));
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
    }
  }

  async getUserById(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch user');
      const user = await response.json();
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company?.name || '',
        botLinks: user.metadata?.botLinks || [],
        location: user.metadata?.location || '',
        businessType: user.metadata?.businessType || '',
        currentTokens: user.metadata?.currentTokens || 0,
        totalPurchasedTokens: user.metadata?.totalPurchasedTokens || 0
      };
    } catch (error) {
      handleApiError(error, 'Failed to fetch user');
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await fetch(`${API_URL}/users/email/${email}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch user by email');
      const user = await response.json();
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company?.name || '',
        botLinks: user.metadata?.botLinks || [],
        location: user.metadata?.location || '',
        businessType: user.metadata?.businessType || '',
        currentTokens: user.metadata?.currentTokens || 0,
        totalPurchasedTokens: user.metadata?.totalPurchasedTokens || 0
      };
    } catch (error) {
      handleApiError(error, 'Failed to fetch user by email');
    }
  }

  async addUser(userData) {
    // Basic client-side validation
    if (!userData.name || !userData.email) throw new Error('Name and email are required');
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          company: userData.company,
          botLinks: userData.botLinks || [],
          location: userData.location || '',
          businessType: userData.businessType || '',
          role: 'user'
        })
      });
      if (!response.ok) throw new Error('Failed to add user');
      const user = await response.json();
      return this.getUserById(user.id);
    } catch (error) {
      handleApiError(error, 'Failed to add user');
    }
  }

  async updateUser(id, updates) {
    if (!id) throw new Error('User ID is required');
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return this.getUserById(id);
    } catch (error) {
      handleApiError(error, 'Failed to update user');
    }
  }

  async addTokens(userId, amount) {
    if (!userId || !amount) throw new Error('User ID and amount are required');
    try {
      const response = await fetch(`${API_URL}/users/${userId}/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount })
      });
      if (!response.ok) throw new Error('Failed to add tokens');
      return this.getUserById(userId);
    } catch (error) {
      handleApiError(error, 'Failed to add tokens');
    }
  }

  async removeUser(id) {
    if (!id) throw new Error('User ID is required');
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to remove user');
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to remove user');
    }
  }
}

export const userService = new UserService();
export { API_URL };
