import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { data } = await supabase.from("users").select();
  const usernames = data?.map(({ url_username }) => url_username)
  return {
    usernames: usernames ?? [],
  }
}