import logger from '../utils/logger';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

class DatabaseService {
  constructor() {
    this.supabase = supabase;
    this.tables = {
      users: 'users',
      companies: 'companies',
      chatTemplates: 'chat_templates'
    };
  }
  
  // Initialize database and create tables if needed
  async init() {
    logger.log('Initializing Supabase database service...');
    
    try {
      // Check if tables exist by querying them
      const { data: companies, error: companiesError } = await this.supabase
        .from(this.tables.companies)
        .select('count')
        .limit(1);
      
      // If tables don't exist or are empty, create them and add demo data
      if (companiesError || !companies || companies.length === 0) {
        logger.log('Setting up database tables and demo data...');
        await this.setupTables();
        await this.addDemoData();
      } else {
        logger.log('Database already initialized');
      }
    } catch (error) {
      logger.error('Error initializing database:', error);
    }
  }
  
  // Create database tables
  async setupTables() {
    try {
      // Create companies table
      const { error: createCompaniesError } = await this.supabase.rpc('create_companies_table');
      if (createCompaniesError) throw createCompaniesError;
      
      // Create users table
      const { error: createUsersError } = await this.supabase.rpc('create_users_table');
      if (createUsersError) throw createUsersError;
      
      // Create chat_templates table
      const { error: createTemplatesError } = await this.supabase.rpc('create_chat_templates_table');
      if (createTemplatesError) throw createTemplatesError;
      
      logger.log('Database tables created successfully');
    } catch (error) {
      logger.error('Error setting up tables:', error);
      
      // If RPC functions don't exist, we'll create tables using SQL
      logger.log('Attempting to create tables using SQL...');
      
      // This is a fallback and would require SQL execution permissions
      // In a real app, you would use migrations or RPC functions
      logger.warn('Table creation via SQL not implemented - please create tables manually');
    }
  }
  
  // Add demo data
  async addDemoData() {
    try {
      // Create demo company
      const companyId = uuidv4();
      const { error: companyError } = await this.supabase
        .from(this.tables.companies)
        .insert([
          {
            id: companyId,
            name: 'Swift Assist',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (companyError) throw companyError;
      
      // Create admin user
      const adminId = uuidv4();
      const { error: adminError } = await this.supabase
        .from(this.tables.users)
        .insert([
          {
            id: adminId,
            company_id: companyId,
            name: 'Admin User',
            email: 'admin@swiftassist.com',
            role: 'admin',
            metadata: {
              botLinks: ['https://bot1.example.com', 'https://bot2.example.com'],
              location: 'Denver, CO',
              businessType: 'Software Development',
              currentTokens: 1000,
              totalPurchasedTokens: 5000
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (adminError) throw adminError;
      
      // Create test user
      const testUserId = uuidv4();
      const { error: testUserError } = await this.supabase
        .from(this.tables.users)
        .insert([
          {
            id: testUserId,
            company_id: companyId,
            name: 'Test Customer',
            email: 'test@acme.com',
            role: 'user',
            metadata: {
              botLinks: ['https://acme-bot.example.com'],
              location: 'New York, NY',
              businessType: 'E-commerce',
              currentTokens: 500,
              totalPurchasedTokens: 2000
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (testUserError) throw testUserError;
      
      // Create demo template
      const templateId = uuidv4();
      const { error: templateError } = await this.supabase
        .from(this.tables.chatTemplates)
        .insert([
          {
            id: templateId,
            company_id: companyId,
            name: 'Customer Support Bot',
            prompt_template: 'You are a helpful customer support assistant for {{company}}.',
            context_data: {
              companyInfo: 'Swift Assist provides AI-powered customer support solutions.'
            },
            settings: {
              model: 'gpt-4',
              temperature: 0.7
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (templateError) throw templateError;
      
      logger.log('Demo data added successfully');
    } catch (error) {
      logger.error('Error adding demo data:', error);
    }
  }
  
  // Users CRUD operations
  async getUsers() {
    const { data, error } = await this.supabase
      .from(this.tables.users)
      .select(`
        *,
        company:companies(*)
      `);
    
    if (error) {
      logger.error('Error fetching users:', error);
      return [];
    }
    
    return data;
  }
  
  async getUserById(id) {
    const { data, error } = await this.supabase
      .from(this.tables.users)
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      logger.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  }
  
  async getUserByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.tables.users)
      .select(`
        *,
        company:companies(*)
      `)
      .eq('email', email)
      .single();
    
    if (error) {
      logger.error('Error fetching user by email:', error);
      return null;
    }
    
    return data;
  }
  
  // Temporary method to bypass RLS for development
  async createUser(userData) {
    try {
      logger.log('Creating user with data:', userData);
      
      // First, create a default company if none exists
      const defaultCompanyName = userData.company || 'Default Company';
      
      // Use a direct SQL query to bypass RLS
      const { data: companies, error: companiesError } = await this.supabase
        .rpc('get_or_create_company', { 
          company_name: defaultCompanyName 
        });
      
      if (companiesError) {
        logger.error('Error with company:', companiesError);
        
        // Fallback: Create company directly with service role
        const newCompanyId = uuidv4();
        const { error: insertError } = await this.supabase
          .from(this.tables.companies)
          .insert({
            id: newCompanyId,
            name: defaultCompanyName,
            subscription_tier: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          logger.error('Error creating company directly:', insertError);
          throw new Error(`Failed to create company: ${insertError.message}`);
        }
        
        var companyId = newCompanyId;
      } else {
        logger.log('Company result:', companies);
        var companyId = companies[0]?.id;
      }
      
      if (!companyId) {
        throw new Error('Failed to get or create company');
      }
      
      // Create user with service role
      const userId = uuidv4();
      const { error: userError } = await this.supabase
        .from(this.tables.users)
        .insert({
          id: userId,
          company_id: companyId,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'user',
          metadata: {
            botLinks: userData.botLinks || [],
            location: userData.location || '',
            businessType: userData.businessType || '',
            currentTokens: userData.currentTokens || 0,
            totalPurchasedTokens: userData.totalPurchasedTokens || 0,
            purchaseHistory: []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (userError) {
        logger.error('Error creating user:', userError);
        throw new Error(`Failed to create user: ${userError.message}`);
      }
      
      // Use a direct query to get the user
      const { data: user, error: getUserError } = await this.supabase
        .from(this.tables.users)
        .select(`
          *,
          company:${this.tables.companies}(*)
        `)
        .eq('id', userId)
        .single();
      
      if (getUserError) {
        logger.error('Error fetching created user:', getUserError);
        throw new Error('User created but could not be retrieved');
      }
      
      return user;
    } catch (error) {
      logger.error('Error in createUser:', error);
      throw new Error('Failed to add user');
    }
  }
  
  async updateUser(id, updates) {
    // Handle company update if needed
    if (updates.company) {
      // Check if company exists
      const { data: existingCompany } = await this.supabase
        .from(this.tables.companies)
        .select('id')
        .eq('name', updates.company)
        .single();
      
      let companyId;
      
      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        // Create new company
        const newCompanyId = uuidv4();
        const { error: companyError } = await this.supabase
          .from(this.tables.companies)
          .insert([
            {
              id: newCompanyId,
              name: updates.company,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        
        if (companyError) {
          logger.error('Error creating company:', companyError);
          throw new Error('Failed to create company');
        }
        
        companyId = newCompanyId;
      }
      
      // Update user's company_id
      const { error: updateCompanyError } = await this.supabase
        .from(this.tables.users)
        .update({ company_id: companyId })
        .eq('id', id);
      
      if (updateCompanyError) {
        logger.error('Error updating user company:', updateCompanyError);
        throw new Error('Failed to update user company');
      }
    }
    
    // Get current user data to merge with updates
    const { data: currentUser } = await this.supabase
      .from(this.tables.users)
      .select('metadata')
      .eq('id', id)
      .single();
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    // Update basic fields if provided
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.role) updateData.role = updates.role;
    
    // Update metadata fields
    const metadata = { ...currentUser.metadata };
    if (updates.botLinks) metadata.botLinks = updates.botLinks;
    if (updates.location) metadata.location = updates.location;
    if (updates.businessType) metadata.businessType = updates.businessType;
    if (updates.currentTokens !== undefined) metadata.currentTokens = updates.currentTokens;
    if (updates.totalPurchasedTokens !== undefined) metadata.totalPurchasedTokens = updates.totalPurchasedTokens;
    
    updateData.metadata = metadata;
    
    // Update user
    const { error: updateError } = await this.supabase
      .from(this.tables.users)
      .update(updateData)
      .eq('id', id);
    
    if (updateError) {
      logger.error('Error updating user:', updateError);
      throw new Error('Failed to update user');
    }
    
    return this.getUserById(id);
  }
  
  async deleteUser(id) {
    const { error } = await this.supabase
      .from(this.tables.users)
      .delete()
      .eq('id', id);
    
    if (error) {
      logger.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
    
    return true;
  }
  
  async addTokens(userId, amount) {
    // Get current user data
    const { data: currentUser } = await this.supabase
      .from(this.tables.users)
      .select('metadata')
      .eq('id', userId)
      .single();
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Update token counts
    const metadata = { ...currentUser.metadata };
    metadata.currentTokens = (metadata.currentTokens || 0) + Number(amount);
    metadata.totalPurchasedTokens = (metadata.totalPurchasedTokens || 0) + Number(amount);
    
    // Add purchase to history
    metadata.purchaseHistory = metadata.purchaseHistory || [];
    metadata.purchaseHistory.push({
      date: new Date().toISOString(),
      amount: Number(amount)
    });
    
    // Update user
    const { error } = await this.supabase
      .from(this.tables.users)
      .update({
        metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      logger.error('Error adding tokens:', error);
      throw new Error('Failed to add tokens');
    }
    
    return this.getUserById(userId);
  }
}

export const databaseService = new DatabaseService();
