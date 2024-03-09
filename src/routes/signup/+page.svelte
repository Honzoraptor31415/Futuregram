<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  export let data;
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

  function usernameCheck(u: string) {
    const allowedUsernameChars = "abcdefghijklmnopqrstuvwxyz1234567890.-";
    const disallowedUsernames = ["feed", "login", "signup", "chat", "about"];
    const containsOnlyAllowedChars = u
      .toLocaleLowerCase()
      .match(`^[${allowedUsernameChars}]+$`);
    const isDisallowedUsername = disallowedUsernames.includes(
      u.toLocaleLowerCase(),
    );

    if (u.length < 1) {
      setLabels("Username can't be empty", "", "", "", "");
    } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
      setLabels("Invalid username", "", "", "", "");
      return false;
    } else if (u.length > 30) {
      setLabels("Username is too long", "", "", "", "");
      return false;
    } else if (data.usernames.includes(username)) {
      setLabels("Username already taken", "", "", "", "");
    } else if (containsOnlyAllowedChars && !isDisallowedUsername) {
      setLabels("", "", "", "", "");
      return true;
    }
  }

  function displayedNameCheck(u: string) {
    if (u.length < 1) {
      setLabels("", "Name can't be empty", "", "", "");
      return false;
    } else if (u.length > 30) {
      setLabels("", "Name is too long", "", "", "");
      return false;
    } else {
      return true;
    }
  }

  function emailCheck(e: string) {
    if (e.length < 1) {
      setLabels("", "", "Email can't be empty", "", "");
      return false;
    } else if (
      !e.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ) ||
      e.length > 255
    ) {
      setLabels("", "", "Invalid email", "", "");
      return false;
    } else {
      setLabels("", "", "", "", "");
      return true;
    }
  }

  function passwordCheck(p: string) {
    if (p.length < 1) {
      setLabels("", "", "", "Password can't be empty", "");
      return false;
    } else if (p.length < 6) {
      setLabels("", "", "", "Password is too short", "");
      return false;
    } else {
      setLabels("", "", "", "", "");
      return true;
    }
  }

  function bioCheck(b: string) {
    if (b.length < 1) {
      setLabels("", "", "", "", "Bio can't be empty");
      return false;
    } else if (b.length > 200) {
      setLabels("", "", "", "", "Bio is too long");
      return false;
    } else {
      setLabels("", "", "", "", "");
      return true;
    }
  }

  async function checkUserInDB() {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("url_username", username);
    console.log(data, error);
    if (data) {
      return data.length > 0;
    }
  }

  async function signUp() {
    username = username.trim();
    displayedName = displayedName.trim();
    email = email.trim().toLocaleLowerCase();
    bio = bio.trim();
    if (!usernameCheck(username)) {
      console.log("Invalid username");
    } else if (!displayedNameCheck(displayedName)) {
      console.log("Displayed username invalid");
    } else if (!emailCheck(email)) {
      console.log("Email invalid");
    } else if (!passwordCheck(password)) {
      console.log("Email invalid");
    } else if (!bioCheck(bio)) {
      console.log("Invalid bio");
    } else {
      setLabels("", "", "", "", "");
      createUserInDB();
    }
  }

  async function createUserAuth(dbID: any) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          db_id: dbID,
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
          class="user-input user-input-text"
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
          class="user-input user-input-text"
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
          class="user-input user-input-text"
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
