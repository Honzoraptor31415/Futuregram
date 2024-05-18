<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import type { DBUserData } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import Feed from "$lib/components/Feed.svelte";
  import * as validation from "$lib/helper/formValidation";
  import FormElement from "$lib/components/FormElement.svelte";
  import { supabase } from "$lib/supabaseClient";

  // by doing this, I prevent the "let's finish signing up!" dialog from even appearing
  let userInDB: string | boolean = "waiting";
  let username = "";
  let displayedName = "";
  let bio = "";
  let usernameLabel = "";
  let displayedNameLabel = "";
  let bioLabel = "";
  let currUser: DBUserData;

  async function getUserDBID(user: AuthUser) {
    if (user) {
      browser && !user.user_metadata.db_id && (userInDB = false);
    }
  }

  loggedInUser.subscribe((val: any) => {
    currUser = val;
    val && getUserDBID(val);
  });

  async function finishSignup() {
    usernameLabel = await validation.usernameCheck(username);
    displayedNameLabel = validation.displayedNameCheck(displayedName);
    bioLabel = validation.bioCheck(bio);
    if (usernameLabel === "" && displayedNameLabel === "" && bioLabel === "") {
      const { data } = await supabase
        .from("users")
        .insert({
          joined_at: new Date().getTime(),
          url_username: username,
          displayed_username: displayedName,
          bio: bio,
        })
        .select();
      if (data && browser) {
        location.href = "/";
        const { error } = await supabase.auth.updateUser({
          data: { db_id: data[0].id },
        });
        console.log(error);
      }
    }
  }
</script>

<svelte:head>
  <title>Futuregram</title>
</svelte:head>

{#if currUser && !userInDB}
  <header
    class="flex-center-all finish-signup mobile-nav-padding desktop-nav-margin"
  >
    <form class="sec-bg-element form" on:submit={finishSignup}>
      <h2>Let's finish signing up!</h2>
      <div class="signup-form-elements">
        <FormElement
          id="username"
          initLabel="Username"
          required={true}
          starClass="left-0"
          placeholder="Username"
          label={usernameLabel}
          bind:value={username}
          type="text"
        />
        <FormElement
          id="displayed-name"
          initLabel="Displayed name"
          required={true}
          starClass="left-0"
          placeholder="Displayed name"
          label={displayedNameLabel}
          bind:value={displayedName}
          type="text"
        />
      </div>
      <FormElement
        wrpClass="w-full"
        id="user-bio"
        placeholder="Bio"
        required={true}
        initLabel="Bio"
        starClass="left-0"
        label={bioLabel}
        bind:value={bio}
        type="textarea"
      />
      <button type="submit" class="user-input button-element primary-button"
        >Finish!</button
      >
    </form>
  </header>
{:else}
  <Feed />
{/if}
