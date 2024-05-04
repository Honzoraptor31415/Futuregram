import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async () => {
  const { data: users } = await supabase.from("users").select();
  const { data: posts } = await supabase.from("posts").select();

  return {
    users: users,
    posts: posts,
  };
};
