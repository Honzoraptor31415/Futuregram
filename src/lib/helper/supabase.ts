import { goto } from "$app/navigation";
import { supabase } from "$lib/supabaseClient";

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  !error && goto("/login");
}
