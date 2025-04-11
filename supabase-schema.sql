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

-- Create audit logging table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit logging function and trigger
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB := NULL;
  new_data JSONB := NULL;
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    old_data = row_to_json(OLD)::JSONB;
    new_data = row_to_json(NEW)::JSONB;
  ELSIF (TG_OP = 'DELETE') THEN
    old_data = row_to_json(OLD)::JSONB;
  ELSIF (TG_OP = 'INSERT') THEN
    new_data = row_to_json(NEW)::JSONB;
  END IF;

  INSERT INTO audit_logs (
    table_name,
    record_id,
    operation,
    old_data,
    new_data,
    changed_at
  )
  VALUES (
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN (old_data->>'id')::UUID
      ELSE (new_data->>'id')::UUID
    END,
    TG_OP,
    old_data,
    new_data,
    NOW()
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to all tables
CREATE TRIGGER audit_companies_changes
AFTER INSERT OR UPDATE OR DELETE ON companies
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_chat_templates_changes
AFTER INSERT OR UPDATE OR DELETE ON chat_templates
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_conversations_changes
AFTER INSERT OR UPDATE OR DELETE ON conversations
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_chat_messages_changes
AFTER INSERT OR UPDATE OR DELETE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Set up row-level security policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create a function to check if user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT company_id
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for multi-tenant isolation
-- Companies: Users can only see their own company unless they're an admin
CREATE POLICY "Users can view their own company" 
ON companies FOR SELECT
USING (id = get_user_company_id() OR is_admin());

CREATE POLICY "Only admins can insert companies" 
ON companies FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update companies" 
ON companies FOR UPDATE
USING (is_admin());

CREATE POLICY "Only admins can delete companies" 
ON companies FOR DELETE
USING (is_admin());

-- Users: Users can only see users from their company unless they're an admin
CREATE POLICY "Users can view users from their company" 
ON users FOR SELECT
USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can insert users in their company" 
ON users FOR INSERT
WITH CHECK (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can update users in their company" 
ON users FOR UPDATE
USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can delete users in their company" 
ON users FOR DELETE
USING (company_id = get_user_company_id() OR is_admin());

-- Chat Templates: Users can only see templates from their company
CREATE POLICY "Users can view templates from their company" 
ON chat_templates FOR SELECT
USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can insert templates in their company" 
ON chat_templates FOR INSERT
WITH CHECK (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can update templates in their company" 
ON chat_templates FOR UPDATE
USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can delete templates in their company" 
ON chat_templates FOR DELETE
USING (company_id = get_user_company_id() OR is_admin());

-- Conversations: Users can only see conversations linked to their company's templates
CREATE POLICY "Users can view conversations from their company" 
ON conversations FOR SELECT
USING (
  chat_template_id IN (
    SELECT id FROM chat_templates 
    WHERE company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can insert conversations for their company" 
ON conversations FOR INSERT
WITH CHECK (
  chat_template_id IN (
    SELECT id FROM chat_templates 
    WHERE company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can update conversations for their company" 
ON conversations FOR UPDATE
USING (
  chat_template_id IN (
    SELECT id FROM chat_templates 
    WHERE company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can delete conversations for their company" 
ON conversations FOR DELETE
USING (
  chat_template_id IN (
    SELECT id FROM chat_templates 
    WHERE company_id = get_user_company_id()
  ) 
  OR is_admin()
);

-- Chat Messages: Users can only see messages from their company's conversations
CREATE POLICY "Users can view messages from their company" 
ON chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN chat_templates t ON c.chat_template_id = t.id
    WHERE t.company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can insert messages for their company" 
ON chat_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN chat_templates t ON c.chat_template_id = t.id
    WHERE t.company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can update messages for their company" 
ON chat_messages FOR UPDATE
USING (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN chat_templates t ON c.chat_template_id = t.id
    WHERE t.company_id = get_user_company_id()
  ) 
  OR is_admin()
);

CREATE POLICY "Users can delete messages for their company" 
ON chat_messages FOR DELETE
USING (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN chat_templates t ON c.chat_template_id = t.id
    WHERE t.company_id = get_user_company_id()
  ) 
  OR is_admin()
);

-- Audit logs: Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON audit_logs FOR SELECT
USING (is_admin());
