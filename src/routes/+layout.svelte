<script lang="ts">
  import "./style.css";
  import Nav from "$lib/components/ui/Nav.svelte";
  import Footer from "$lib/components/ui/Footer.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { disableScrollHandling, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import userDbData, { userLoaded } from "$lib/stores/userDbData";
  import loggedInUser from "$lib/stores/user";
  import { actionWarning, appNotifications } from "$lib/stores/app";
  import Modal from "$lib/components/ui/Modal.svelte";
  import AppNotification from "$lib/components/ui/AppNotification.svelte";
  import { setNotification } from "$lib/helper/appNotifications";

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
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      loggedInUser.set(data.user);
      getUserDbData(data.user.user_metadata.db_id);
    } else {
      userDbData.set(null);
    }

    if (data) {
      userLoaded.set(true);
    }
  }
  getAuthUser();
  async function getUserDbData(id: string) {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();
    data ? userDbData.set(data) : userDbData.set(null);
  }
</script>

{#if browser && nav}
  <Nav />
{/if}

{#if $actionWarning}
  <Modal
    heading={$actionWarning.heading}
    text={$actionWarning.text}
    func={$actionWarning.func}
  />
{/if}

<slot />

{#if $appNotifications.length > 0}
  {#each $appNotifications as { text, disappearing, linkHref, linkText, id }}
    <AppNotification {text} {disappearing} {linkHref} {linkText} notifId={id} />
  {/each}
{/if}

<Footer />
