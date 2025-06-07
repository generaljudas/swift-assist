-- Migration: Add public chat header and subheader to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS public_chat_header TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS public_chat_subheader TEXT;
