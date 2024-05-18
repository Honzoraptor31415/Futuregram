<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import { browser } from "$app/environment";
  import type { AuthUser } from "$lib/types/auth";
  import type { DBUserData } from "$lib/types/db";
  import RedFormStar from "$lib/components/RedFormStar.svelte";
  import FormElement from "$lib/components/FormElement.svelte";

  let currLoggedInUser: AuthUser;
  let currUserDbData: DBUserData;
  let email = "";
  let emailLabel = "";
  let bio = "";
  let bioLabel = "";
  let username = "";
  let usernameLabel = "";
  let displayedName = "";
  let displayedNameLabel = "";

  userDbData.subscribe((val: any) => {
    currUserDbData = val;
  });

  async function editProfile() {
    console.log(`Edit profile function\n${username}`);
  }
</script>

<svelte:head>
  <title>Your settings</title>
</svelte:head>

{#if currUserDbData}
  <main class="settings-main inline-auto sec-bg-element nav-top-space form-gap">
    <h2 class="form-margin-bottom">Settings</h2>
    <div class="settings-content">
      <section class="settings-section">
        <h3 class="settings-section-heading">Profile settings</h3>
        <form on:submit={editProfile} class="settings-section-row">
          <FormElement
            id="username"
            initLabel="Username"
            placeholder="Username"
            label="Username"
            bind:value={username}
          />
          <button class="user-input button-element primary-button"
            >Submit</button
          >
        </form>
      </section>
    </div>
  </main>
{/if}
