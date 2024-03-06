import { supabase } from "$lib/supabaseClient";

// testing server side stuff

export async function load() {
  const { data } = await supabase.from("users").select("*");
  return {
    posts: data ?? [],
  };
}