<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import type { dbUserData } from "$lib/types/db";
  import type { authUser } from "$lib/types/auth";
  export let data;
  import RedFormStar from "$lib/components/RedFormStar.svelte";

  // by doing this, I prevent the "let's finish signing up!" dialog from even appearing
  let userInDB: string | boolean = "waiting";
  let username = "";
  let displayedName = "";
  let bio = "";
  let usernameLabel = "";
  let displayedNameLabel = "";
  let bioLabel = "";
  let currUser: dbUserData;

  async function getUserDBID(user: authUser) {
    if (user) {
      browser && !user.user_metadata.db_id
        ? (userInDB = false)
        : browser && user.user_metadata.db_id
          ? (location.href = "/feed")
          : null;
    }
  }

  loggedInUser.subscribe((val: any) => {
    currUser = val;
    val
      ? getUserDBID(val)
      : val === null && browser && (location.href = "/signup");
  });

  function usernameCheck() {
    const allowedUsernameChars = "abcdefghijklmnopqrstuvwxyz1234567890.-";
    const disallowedUsernames = [
      "feed",
      "login",
      "signup",
      "chat",
      "about",
      "search",
    ];
    const containsOnlyAllowedChars = username
      .toLocaleLowerCase()
      .match(`^[${allowedUsernameChars}]+$`);
    const isDisallowedUsername = disallowedUsernames.includes(
      username.toLocaleLowerCase(),
    );

    if (username.length < 1) {
      setLabels("Username can't be empty", "", "");
    } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
      setLabels("Invalid username", "", "");
      return false;
    } else if (username.length > 30) {
      setLabels("Username is too long", "", "");
      return false;
    } else if (data.usernames.includes(username)) {
      setLabels("Username already taken", "", "");
    } else if (containsOnlyAllowedChars && !isDisallowedUsername) {
      setLabels("", "", "");
      return true;
    }
  }

  function displayedNameCheck() {
    if (displayedName.length < 1) {
      setLabels("", "Name can't be empty", "");
      return false;
    } else if (displayedName.length > 30) {
      setLabels("", "Name is too long", "");
      return false;
    } else {
      return true;
    }
  }

  function bioCheck() {
    if (bio.length < 1) {
      setLabels("", "", "Bio can't be empty");
      return false;
    } else if (bio.length > 200) {
      setLabels("", "", "Bio is too long");
      return false;
    } else {
      setLabels("", "", "");
      return true;
    }
  }

  async function finishSignup() {
    if (usernameCheck() && displayedNameCheck() && bioCheck()) {
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
        location.href = "/feed";
        const {
          data: { user },
          error,
        } = await supabase.auth.updateUser({ data: { db_id: data[0].id } });
        console.log(error);
      }
    }
  }

  function setLabels(username: string, displayedName: string, bio: string) {
    usernameLabel = username;
    displayedNameLabel = displayedName;
    bioLabel = bio;
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
              Username <RedFormStar startClass="left-0" />
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
              Displayed name <RedFormStar startClass="left-0" />
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
      <div class="form-element signup-full-width">
        <label
          for="user-bio"
          class={`no-tp ${bioLabel !== "" ? "form-error" : ""}`}
        >
          {#if bioLabel === ""}
            Bio <RedFormStar startClass="left-0" />
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
{/if}
