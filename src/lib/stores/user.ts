import { supabase } from "$lib/supabaseClient";
import { writable } from "svelte/store";

const loggedInUser = writable()

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    loggedInUser.set(user)
  } else {
    loggedInUser.set(null)
  }
}
getUser()

export default loggedInUser