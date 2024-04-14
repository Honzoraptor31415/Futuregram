<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import type { DBUserData } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  export let data;
  import RedFormStar from "$lib/components/RedFormStar.svelte";
  import Feed from "$lib/components/Feed.svelte";
  import * as validation from "$lib/helper/form-validation";

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
    val
      ? getUserDBID(val)
      : val === null && browser && (location.href = "/signup");
  });

  async function finishSignup() {
    usernameLabel = validation.usernameCheck(username, data.usernames);
    displayedNameLabel = validation.displayedNameCheck(displayedName);
    bioLabel = validation.bioCheck(bio);
    if (
      validation.usernameCheck(username, data.usernames) &&
      validation.displayedNameCheck(displayedName) &&
      validation.bioCheck(bio)
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

{#if currUser && !userInDB}
  <header class="flex-center-all finish-signup mobile-nav-padding">
    <form class="sec-bg-element form" on:submit={finishSignup}>
      <h2>Let's finish signing up!</h2>
      <div class="signup-form-elements">
        <div class="form-element">
          <label
            for="username"
            class={`no-tp ${usernameLabel !== "" ? "form-error" : ""}`}
          >
            {#if usernameLabel === ""}
              Username <RedFormStar starClass="left-0" />
            {:else}
              {usernameLabel}
            {/if}
          </label>
          <input
            type="text"
            id="username"
            bind:value={username}
            class={`user-input user-input-text ${usernameLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Username"
          />
        </div>
        <div class="form-element">
          <label
            for="displayed-name"
            class={`no-tp ${displayedNameLabel !== "" ? "form-error" : ""}`}
          >
            {#if displayedNameLabel === ""}
              Displayed name <RedFormStar starClass="left-0" />
            {:else}
              {displayedNameLabel}
            {/if}
          </label>
          <input
            type="text"
            id="displayed-name"
            bind:value={displayedName}
            class={`user-input user-input-text ${displayedNameLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Displayed name"
          />
        </div>
      </div>
      <div class="form-element w-full">
        <label
          for="user-bio"
          class={`no-tp ${bioLabel !== "" ? "form-error" : ""}`}
        >
          {#if bioLabel === ""}
            Bio <RedFormStar starClass="left-0" />
          {:else}
            {bioLabel}
          {/if}
        </label>
        <textarea
          bind:value={bio}
          id="user-bio"
          placeholder="Your bio"
          class={`user-input user-input-text ${bioLabel !== "" ? "form-error-input" : ""}`}
        ></textarea>
      </div>
      <button type="submit" class="user-input button-element primary-button"
        >Finish!</button
      >
    </form>
  </header>
{:else}
  <Feed />
{/if}
