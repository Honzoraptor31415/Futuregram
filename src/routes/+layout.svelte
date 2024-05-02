<script lang="ts">
  import "./style.css";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import userDbData from "$lib/stores/user-db-data";
  import loggedInUser from "$lib/stores/user";

  export let data;

  const navDisallowedLocations = ["login", "signup"];
  let nav = true;
  page.subscribe((val: any) => {
    if (browser) {
      nav = !navDisallowedLocations.includes(
        val.url.pathname.replaceAll("/", "")
      );
    }
  });

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });

  async function getAuthUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      loggedInUser.set(user);
      getUserDBData(user.user_metadata.db_id);
    }
  }
  getAuthUser();
  async function getUserDBData(id: string) {
    const { data } = await supabase.from("users").select().eq("id", id);
    data ? userDbData.set(data[0]) : userDbData.set(null);
  }
</script>

{#if browser && nav}
  <Nav />
{/if}
<slot />
<Footer />
