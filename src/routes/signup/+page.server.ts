import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { session, user } = await event.locals.safeGetSession()

  console.log(user, session);


  const { data } = await supabase.from("users").select();
  const usernames = data?.map(({ url_username }) => url_username)
  return {
    usernames: usernames ?? [],
  }
}