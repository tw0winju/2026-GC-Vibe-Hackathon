import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const supabaseUrl = new URL(process.env.SUPABASE_URL || "").origin;

export const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
