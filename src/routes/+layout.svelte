<script>
  import "./style.css";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  const currentUser = writable();
  $: currentUser.set("");

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    user
      ? console.log(`Logged in\n${user}`)
      : console.log("You're not logged in");
    user ? currentUser.set(user) : currentUser.set("");
  }
  getUser();
  setContext("currentUser", currentUser);
</script>

<Nav />
<slot />
<Footer />
