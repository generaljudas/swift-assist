import logger from '../utils/logger';
import { databaseService } from './databaseService';

class UserService {
  constructor() {
    databaseService.init();
  }

  async getAllUsers() {
    try {
      const users = await databaseService.getUsers();
      
      // Format the data to match the expected structure in the UI
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company?.name || '',
        botLinks: user.metadata?.botLinks || [],
        location: user.metadata?.location || '',
        businessType: user.metadata?.businessType || '',
        currentTokens: user.metadata?.currentTokens || 0,
        totalPurchasedTokens: user.metadata?.totalPurchasedTokens || 0
      }));
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getUserById(id) {
    try {
      const user = await databaseService.getUserById(id);
      
      if (!user) return null;
      
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
      logger.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await databaseService.getUserByEmail(email);
      
      if (!user) return null;
      
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
      logger.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user by email');
    }
  }

  async addUser(userData) {
    try {
      const user = await databaseService.createUser({
        name: userData.name,
        email: userData.email,
        company: userData.company,
        botLinks: userData.botLinks || [],
        location: userData.location || '',
        businessType: userData.businessType || '',
        role: 'user'
      });
      
      return this.getUserById(user.id);
    } catch (error) {
      logger.error('Error adding user:', error);
      throw new Error('Failed to add user');
    }
  }

  async updateUser(id, updates) {
    try {
      await databaseService.updateUser(id, updates);
      return this.getUserById(id);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async addTokens(userId, amount) {
    try {
      await databaseService.addTokens(userId, amount);
      return this.getUserById(userId);
    } catch (error) {
      logger.error('Error adding tokens:', error);
      throw new Error('Failed to add tokens');
    }
  }

  async removeUser(id) {
    try {
      return await databaseService.deleteUser(id);
    } catch (error) {
      logger.error('Error removing user:', error);
      throw new Error('Failed to remove user');
    }
  }
}

export const userService = new UserService();
