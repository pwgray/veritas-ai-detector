import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env without crashing in browser environments
const getEnv = (key: string) => {
  try {
    return process.env[key];
  } catch {
    return undefined;
  }
};

// Use environment variables if available, otherwise use placeholders to prevent 'supabaseUrl is required' crash
const SUPABASE_URL = getEnv('SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY') || 'placeholder-key';

// Log warning if running with placeholders
if (SUPABASE_URL === 'https://placeholder-project.supabase.co') {
  console.warn(
    "Supabase credentials are missing or invalid. Authentication and database features will not work.\n" +
    "Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);