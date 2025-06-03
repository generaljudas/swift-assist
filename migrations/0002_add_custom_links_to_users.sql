-- Migration: Add custom_links column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;
