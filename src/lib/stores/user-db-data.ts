import { writable } from "svelte/store";
import { supabase } from "$lib/supabaseClient";
import loggedInUser from "$lib/stores/user";

const userDbData = writable()

loggedInUser.subscribe((val: any) => {
  val ? getDbUser(val.user_metadata.db_id) : userDbData.set(null)
})

async function getDbUser(uid: string) {
  const { data } = await supabase.from("users").select().eq("id", uid)
  data && userDbData.set(data[0])
}

export default userDbData