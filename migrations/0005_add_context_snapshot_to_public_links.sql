-- Migration: Add context_snapshot to public_links for storing immutable chatbot context
ALTER TABLE public_links ADD COLUMN IF NOT EXISTS context_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;
-- This column will store the chatbot context (e.g., instructions, LLM params) for each custom link.
