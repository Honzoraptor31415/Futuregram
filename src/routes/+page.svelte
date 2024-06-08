<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import type { DbUser } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import Feed from "$lib/components/feed/Feed.svelte";
  import * as validation from "$lib/helper/formValidation";
  import FormElement from "$lib/components/forms/FormElement.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { title } from "$lib/constants";
  import { description } from "$lib/constants";
  import { imageUrl } from "$lib/constants";
  import { onMount } from "svelte";

  // by doing this, I prevent the "let's finish signing up!" dialog from even appearing
  let userInDb: string | boolean = "waiting";
  let username = "";
  let displayedName = "";
  let bio = "";
  let usernameLabel = "";
  let displayedNameLabel = "";
  let bioLabel = "";
  let currUser: DbUser;

  async function getUserDbId(user: AuthUser) {
    if (user) {
      browser && !user.user_metadata.db_id && (userInDb = false);
    }
  }

  loggedInUser.subscribe((val: any) => {
    currUser = val;
    val && getUserDbId(val);
  });

  async function finishSignup() {
    const usernameCheckResponse = await validation.usernameCheck(username);
    usernameLabel = usernameCheckResponse.message;
    displayedNameLabel = validation.displayedNameCheck(displayedName).message;
    bioLabel = validation.bioCheck(bio).message;
    if (
      usernameCheckResponse.isValid &&
      validation.displayedNameCheck(displayedName).isValid &&
      validation.bioCheck(bio).isValid
    ) {
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
  <title>{title}</title>

  <meta property="og:title" content={title} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />

  <!-- I'm using the logo as an og image, just because I suck at designing, so I'm rather gonna use the logo, than a terribly designed banner -->
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="500" />
</svelte:head>

{#if currUser && !userInDb}
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
          isValid={usernameLabel === ""}
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
          isValid={displayedNameLabel === ""}
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
        isValid={bioLabel === ""}
      />
      <button type="submit" class="user-input button-element primary-button"
        >Finish!</button
      >
    </form>
  </header>
{:else}
  <Feed />
{/if}
