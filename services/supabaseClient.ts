import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL as FILE_URL, SUPABASE_ANON_KEY as FILE_KEY } from '../.env';

// Helper to safely access process.env without crashing in browser environments
const getEnv = (key: string) => {
  try {
    return process.env[key];
  } catch {
    return undefined;
  }
};

// User provided credentials from the .env.ts file
const PROVIDED_URL = FILE_URL;
const PROVIDED_KEY = FILE_KEY;

const envUrl = getEnv('SUPABASE_URL');
const envKey = getEnv('SUPABASE_ANON_KEY');

// Use provided credentials if env vars are missing
const SUPABASE_URL = envUrl || PROVIDED_URL;
const SUPABASE_KEY = envKey || PROVIDED_KEY;

// Determine if we have valid credentials.
export const isSupabaseConfigured = !!(
  SUPABASE_URL && 
  SUPABASE_KEY && 
  SUPABASE_URL !== 'https://placeholder-project.supabase.co'
);

if (!isSupabaseConfigured) {
  console.warn("Veritas: Supabase not configured. Falling back to local demo mode.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);