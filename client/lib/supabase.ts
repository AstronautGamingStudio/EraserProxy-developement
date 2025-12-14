import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not configured. Auth features will not work. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.",
  );
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export a dummy client that won't throw if env vars are missing
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
    );
  }
  return supabase;
};

export { supabase };

export type { User, Session } from "@supabase/supabase-js";
