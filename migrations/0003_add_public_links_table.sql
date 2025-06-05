-- Migration: Add public_links table for custom chat links
CREATE TABLE IF NOT EXISTS public_links (
    id SERIAL PRIMARY KEY,
    custom_link_name TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Optionally, you could add a context snapshot column if you want to freeze the context at link creation
-- context_snapshot TEXT
