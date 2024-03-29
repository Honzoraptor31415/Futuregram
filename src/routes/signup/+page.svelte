<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  export let data;

  loggedInUser.subscribe((val) => {
    browser && val && (location.href = "/");
  });

  let email = "";
  let password = "";
  let username = "";
  let displayedName = "";
  let bio = "";
  let usernameLabel = "";
  let passwordLabel = "";
  let displayedNameLabel = "";
  let emailLabel = "";
  let bioLabel = "";
  let verifyEmail = false;

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
      usernameLabel = "Username can't be empty";
    } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
      usernameLabel = "Invalid username";
      return false;
    } else if (username.length > 30) {
      usernameLabel = "Username is too long";
      return false;
    } else if (data.usernames.includes(username)) {
      usernameLabel = "Username already taken";
    } else if (containsOnlyAllowedChars && !isDisallowedUsername) {
      usernameLabel = "";
      return true;
    }
  }

  function displayedNameCheck() {
    if (displayedName.length < 1) {
      displayedNameLabel = "Name can't be empty";
      return false;
    } else if (displayedName.length > 30) {
      displayedNameLabel = "Name is too long";
      return false;
    } else {
      displayedNameLabel = "";
      return true;
    }
  }

  function emailCheck() {
    if (email.length < 1) {
      emailLabel = "Email can't be empty";
      return false;
    } else if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ) ||
      email.length > 255
    ) {
      emailLabel = "Invalid email";
      return false;
    } else {
      emailLabel = "";
      return true;
    }
  }

  function passwordCheck() {
    if (password.length < 1) {
      passwordLabel = "Password can't be empty";
      return false;
    } else if (password.length < 6) {
      passwordLabel = "Password is too short";
      return false;
    } else {
      passwordLabel = "";
      return true;
    }
  }

  function bioCheck() {
    if (bio.length < 1) {
      bioLabel = "Bio can't be empty";
      return false;
    } else if (bio.length > 200) {
      bioLabel = "Bio is too long";
      return false;
    } else {
      bioLabel = "";
      return true;
    }
  }

  async function signUp() {
    username = username.trim();
    displayedName = displayedName.trim();
    email = email.trim().toLowerCase();
    bio = bio.trim();
    usernameCheck();
    displayedNameCheck();
    emailCheck();
    passwordCheck();
    bioCheck();
    if (
      usernameCheck() &&
      displayedNameCheck() &&
      emailCheck() &&
      passwordCheck() &&
      bioCheck()
    ) {
      usernameLabel = "";
      displayedNameLabel = "";
      emailLabel = "";
      passwordLabel = "";
      bioLabel = "";
      createUserInDB();
      verifyEmail = true;
    }
  }

  async function createUserAuth(dbID: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          db_id: dbID,
          name: displayedName,
        },
      },
    });
    console.log(error);
    return error;
  }

  async function createUserInDB() {
    const { data, error } = await supabase
      .from("users")
      .insert({
        joined_at: new Date().getTime(),
        url_username: username,
        displayed_username: displayedName,
        bio: bio,
      })
      .select();
    console.log(data, error);
    if (data) {
      createUserAuth(data[0].id);
    } else {
      console.log("Something went wrong");
    }
    return error;
  }

  async function googleSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log(data, error);
  }

  async function githubSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    console.log(data, error);
  }
</script>

<svelte:head>
  <title>Sign up for an account</title>
</svelte:head>

<header class="flex-center-all">
  {#if !verifyEmail}
    <form class="sec-bg-element form" on:submit={signUp}>
      <h2>Create an account 👇</h2>
      <div class="other-login-wrp">
        <button
          type="button"
          on:click={googleSignIn}
          class="other-login flex-center-all"
          >Continue with<img
            src="google-icon.svg"
            alt="Google icon"
            class="other-login-icon no-select"
          /></button
        >
        <button
          type="button"
          on:click={githubSignIn}
          class="other-login flex-center-all"
          >Continue with<img
            src="github-icon.svg"
            alt="Github icon"
            class="other-login-icon no-select"
          /></button
        >
      </div>
      <div class="login-line-wrp">
        <div class="line"></div>
        <p class="less login-or">or</p>
        <div class="line"></div>
      </div>
      <div class="signup-form-elements">
        <div class="form-element">
          <label
            for="username"
            class={`no-tp ${usernameLabel !== "" ? "form-error" : ""}`}
            >{usernameLabel === "" ? "Username" : usernameLabel}</label
          >
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
            >{displayedNameLabel === ""
              ? "Displayed username"
              : displayedNameLabel}</label
          >
          <input
            type="text"
            id="displayed-name"
            bind:value={displayedName}
            class={`user-input user-input-text ${displayedNameLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Displayed name"
          />
        </div>
        <div class="form-element">
          <label for="email" class={emailLabel !== "" ? "form-error" : ""}
            >{emailLabel === "" ? "Email" : emailLabel}</label
          >
          <input
            type="text"
            id="email"
            bind:value={email}
            class={`user-input user-input-text ${emailLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Email"
          />
        </div>
        <div class="form-element">
          <label for="password" class={passwordLabel !== "" ? "form-error" : ""}
            >{passwordLabel === "" ? "Password" : passwordLabel}</label
          >
          <input
            type="password"
            id="password"
            bind:value={password}
            class={`user-input user-input-text ${passwordLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Password"
          />
        </div>
      </div>
      <div class="form-element signup-full-width">
        <label for="user-bio" class={bioLabel !== "" ? "form-error" : ""}
          >{bioLabel === "" ? "Bio" : bioLabel}</label
        >
        <textarea
          bind:value={bio}
          id="user-bio"
          placeholder="Your bio"
          class={`user-input user-input-text ${bioLabel !== "" ? "form-error-input" : ""}`}
        ></textarea>
      </div>
      <p class="less">
        Already have an account? <a href="/login">Login</a>.
      </p>
      <button type="submit" class="user-input button-element primary-button"
        >Create account!</button
      >
    </form>
  {:else}
    <div class="sec-bg-element form email-sent">
      <div class="flex-between">
        <h2>Check your email!</h2>
      </div>
      <div class="line"></div>
      <p class="less">
        We sent you an email at <b>email@fake.org</b>. All you have to do is
        click the link in the email!
      </p>
    </div>
  {/if}
</header>
