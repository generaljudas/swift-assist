-- Migration: Add appearance settings to public_links
ALTER TABLE public_links ADD COLUMN IF NOT EXISTS appearance_settings JSONB DEFAULT '{}'::jsonb;
-- Example settings: {"theme":"dark","primaryColor":"#123456","logoUrl":"..."}
