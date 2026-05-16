import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const supabaseUrl = new URL(env.SUPABASE_URL).origin;

export const supabase = createClient(
  supabaseUrl,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
