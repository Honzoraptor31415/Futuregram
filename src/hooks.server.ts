import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const handle: Handle = async ({ event, resolve }) => {
  const { data } = await supabase.auth.getUser()
  console.log(data);


  const response = await resolve(event);

  return response;
};