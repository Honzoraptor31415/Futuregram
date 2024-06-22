<script lang="ts">
  import "./style.css";
  import Nav from "$lib/components/ui/Nav.svelte";
  import Footer from "$lib/components/ui/Footer.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import userDbData from "$lib/stores/userDbData";
  import loggedInUser from "$lib/stores/user";
  import { actionWarning, appNotifications } from "$lib/stores/app";
  import Modal from "$lib/components/ui/Modal.svelte";
  import AppNotification from "$lib/components/ui/AppNotification.svelte";

  export let data;

  const navDisallowedLocations = ["login", "signup"];
  let isNavDisplayed = true;

  page.subscribe((val: any) => {
    if (browser) {
      isNavDisplayed = !navDisallowedLocations.includes(
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

    authListener();

    return () => data.subscription.unsubscribe();
  });

  async function getAuthUser() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      loggedInUser.set(data.user);
      getUserDbData(data.user.id);
    } else {
      userDbData.set(null);
      loggedInUser.set(null);
    }
  }
  getAuthUser();

  function authListener() {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (event === "SIGNED_OUT") {
        userDbData.set(null);
        loggedInUser.set(null);
      }
    });

    data.subscription.unsubscribe();
  }

  async function getUserDbData(id: string) {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("auth_id", id)
      .single();
    data ? userDbData.set(data) : userDbData.set(null);
  }
</script>

{#if isNavDisplayed}
  <Nav />
{/if}

{#if $actionWarning}
  <Modal
    heading={$actionWarning.heading}
    text={$actionWarning.text}
    func={$actionWarning.func}
    continueBtnText={$actionWarning.continueBtnText}
  />
{/if}

<slot />

{#if $appNotifications.length > 0}
  {#each $appNotifications as { text, disappearing, linkHref, linkText, id }}
    <AppNotification {text} {disappearing} {linkHref} {linkText} notifId={id} />
  {/each}
{/if}

<Footer />
