import { supabase } from "$lib/supabaseClient";
import { writable } from "svelte/store";

const loggedInUser = writable()

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  user && loggedInUser.set(user)
}
getUser()

export default loggedInUser