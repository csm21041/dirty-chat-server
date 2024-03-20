import { createClient } from "@supabase/supabase-js";

export default function createSupabaseClient() {
  const url = process.env.SUPABASE_URL ?? "";
  const api = process.env.SUPABASE_API ?? "";
  if (url === "" || api === "") {
    throw new Error("No url or api key found for supabase");
  }
  const supabase = createClient(url, api);
  return supabase;
}
