<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { getContext } from "svelte";
  import { browser } from "$app/environment";
  const currentUser: any = getContext("currentUser");
  if (!currentUser && browser) {
    location.href = "/signup";
  }
  async function continueSignup() {}
</script>

<svelte:head>
  <title>Sign up for an account</title>
</svelte:head>

<header class="flex-center-all">
  <form on:submit={continueSignup} class="sec-bg-element form">
    <h2>Just a few more steps!</h2>
  </form>
</header>
