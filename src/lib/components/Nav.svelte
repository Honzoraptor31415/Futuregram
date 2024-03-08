<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  let currentUser: string;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
    currentUser = "";
  }

  async function getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user !== null) {
      currentUser = user.user_metadata.name;
    }
  }
  getUser();
</script>

{#if currentUser}
  <nav>
    <p class="user-nav-indicator">Logged in as {currentUser}</p>
    <button class="user-input button-element primary-button" on:click={signOut}
      >Sign out</button
    >
  </nav>
{:else}
  <nav>
    <p class="user-nav-indicator">Not logged in</p>
    <a href="login" class="button-link user-input button-element primary-button"
      >Login</a
    >
  </nav>
{/if}
