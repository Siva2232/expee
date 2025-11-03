// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
