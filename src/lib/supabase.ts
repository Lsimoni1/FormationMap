import { createClient } from "@supabase/supabase-js";

// These come from your .env.local file
// Vite exposes env variables prefixed with VITE_ via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

// Create and export a single Supabase client instance
// This client handles all communication with your Supabase project:
// - Authentication (signUp, signIn, signOut)
// - Database queries (select, insert, update, delete)
// - Real-time subscriptions (for future features)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
