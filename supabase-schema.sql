-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  metadata JSONB, -- Using JSONB for better performance in PostgreSQL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Templates table
CREATE TABLE IF NOT EXISTS chat_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  prompt_template TEXT NOT NULL,
  context_data JSONB,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_template_id UUID NOT NULL REFERENCES chat_templates(id) ON DELETE CASCADE,
  end_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_chat_templates_company_id ON chat_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_chat_template_id ON conversations(chat_template_id);
CREATE INDEX IF NOT EXISTS idx_conversations_end_user_id ON conversations(end_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_active_at ON conversations(last_active_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create RPC functions for table creation (used by our application)
CREATE OR REPLACE FUNCTION create_companies_table()
RETURNS void AS $$
BEGIN
  -- Table is already created above, this is just a placeholder for the RPC call
  RAISE NOTICE 'Companies table already exists';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  -- Table is already created above, this is just a placeholder for the RPC call
  RAISE NOTICE 'Users table already exists';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_chat_templates_table()
RETURNS void AS $$
BEGIN
  -- Table is already created above, this is just a placeholder for the RPC call
  RAISE NOTICE 'Chat templates table already exists';
END;
$$ LANGUAGE plpgsql;
