import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("users").select();
  const usernames = data?.map(({ url_username }) => url_username)
  return {
    usernames: usernames ?? [],
  };
}