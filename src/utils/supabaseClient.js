import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ndjikafopssxqkoxkhzc.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kamlrYWZvcHNzeHFrb3hraHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDk5MjIsImV4cCI6MjA1OTg4NTkyMn0.vOrcV03evIdGJnDUNE-XRDxNVLKZWJqBnIlitTXm71s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;