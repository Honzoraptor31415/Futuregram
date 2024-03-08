<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
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

  function usernameCharsCheck(u: string) {
    const allowedUsernameChars = "abcdefghijklmnopqrstuvwxyz1234567890.-";
    const disallowedUsernames = ["feed", "login", "signup", "chat", "about"];
    const containsOnlyAllowedChars = u
      .toLocaleLowerCase()
      .match(`^[${allowedUsernameChars}]+$`);
    const isDisallowedUsername = disallowedUsernames.includes(
      u.toLocaleLowerCase(),
    );

    if (containsOnlyAllowedChars && !isDisallowedUsername) {
      return true;
    } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
      return false;
    }
  }

  usernameCharsCheck("");
  async function signUp() {
    if (!usernameCharsCheck(username)) {
      setLabels("Invalid username", "", "", "", "");
      console.log("Invalid username");
    } else if (username.length > 30) {
      setLabels("Username too long", "", "", "", "");
    } else if (displayedName.length > 15) {
      setLabels("", "Name too long", "", "", "");
    } else if (!email.split("@")[1].split("").includes(".")) {
      setLabels("", "", "Invalid email", "", "");
    } else if (password.length < 7) {
      setLabels("", "", "", "Password is too short", "");
    } else if (bio.length > 200) {
      setLabels("", "", "", "", "Bio is too long");
    } else {
      setLabels("", "", "", "", "");
      createUserAuth();
      createUserInDB();
    }
  }

  async function createUserAuth() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(error);
    return error;
  }

  async function createUserInDB() {
    const { error } = await supabase.from("users").insert({
      joined_at: new Date().getTime(),
      url_username: username,
      displayed_username: displayedName,
      bio: bio,
    });
    console.log(error);
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

  async function getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user && browser) {
      location.href = "/feed";
    }
  }
  getUser();

  function setLabels(
    username: string,
    displayedName: string,
    email: string,
    password: string,
    bio: string,
  ) {
    usernameLabel = username;
    displayedNameLabel = displayedName;
    emailLabel = email;
    passwordLabel = password;
    bioLabel = bio;
  }
</script>

<svelte:head>
  <title>Sign up for an account</title>
</svelte:head>

<header class="flex-center-all">
  <form class="sec-bg-element form" on:submit={signUp}>
    <h2>Create an account 👇</h2>
    <div class="other-login-wrp">
      <button type="button" on:click={googleSignIn} class="other-login"
        >Continue with<img
          src="google-icon.svg"
          alt="Google icon"
          class="other-login-icon no-select"
        /></button
      >
      <button type="button" on:click={githubSignIn} class="other-login"
        >Continue with<img
          src="github-icon.svg"
          alt="Github icon"
          class="other-login-icon no-select"
        /></button
      >
    </div>
    <div class="signup-form-elements">
      <div class="form-element">
        <label for="username" class={usernameLabel !== "" ? "form-error" : ""}
          >{usernameLabel === "" ? "Username" : usernameLabel}</label
        >
        <input
          required
          type="text"
          id="username"
          bind:value={username}
          class="user-input user-input-text"
          placeholder="Username"
        />
      </div>
      <div class="form-element">
        <label
          for="displayed-name"
          class={displayedNameLabel !== "" ? "form-error" : ""}
          >{displayedNameLabel === ""
            ? "Displayed username"
            : displayedNameLabel}</label
        >
        <input
          required
          type="text"
          id="displayed-name"
          bind:value={displayedName}
          class="user-input user-input-text"
          placeholder="Displayed name"
        />
      </div>
      <div class="form-element">
        <label for="email" class={emailLabel !== "" ? "form-error" : ""}
          >{emailLabel === "" ? "Email" : emailLabel}</label
        >
        <input
          required
          type="email"
          id="email"
          bind:value={email}
          class="user-input user-input-text"
          placeholder="Email"
        />
      </div>
      <div class="form-element">
        <label for="password" class={passwordLabel !== "" ? "form-error" : ""}
          >{passwordLabel === "" ? "Password" : passwordLabel}</label
        >
        <input
          required
          type="password"
          id="password"
          bind:value={password}
          class="user-input user-input-text"
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
        class="user-input user-input-text"
      ></textarea>
    </div>
    <p class="less">
      Already have an account? <a href="/login">Login</a>.
    </p>
    <button type="submit" class="user-input button-element primary-button"
      >Create account!</button
    >
  </form>
</header>
