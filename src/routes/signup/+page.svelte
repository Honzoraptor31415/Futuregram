<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let password = "";
  let username = "";
  let displayedName = "";
  let usernameLabel = "Username";
  let passwordLabel = "Password";
  let displayedNameLabel = "Displayed username";
  let emailLabel = "Email";

  function usernameCharsCheck(u: String) {
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
      usernameLabel = "Invalid username";
      emailLabel = "Email";
      passwordLabel = "Password";
      displayedNameLabel = "Displayed username";
    } else if (username.length > 30) {
      usernameLabel = "Username too long";
      passwordLabel = "Password";
      emailLabel = "Email";
      displayedNameLabel = "Displayed username";
    } else if (displayedName.length > 40) {
      displayedNameLabel = "Name too long";
      usernameLabel = "Username";
      emailLabel = "Email";
      passwordLabel = "Password";
    } else if (!email.split("@")[1].split("").includes(".")) {
      usernameLabel = "Username";
      displayedNameLabel = "Displayed username";
      passwordLabel = "Password";
      emailLabel = "Invalid email";
    } else if (password.length < 7) {
      usernameLabel = "Username";
      displayedNameLabel = "Displayed username";
      passwordLabel = "Password is too short";
      emailLabel = "Email";
    } else {
      usernameLabel = "Username";
      passwordLabel = "Password";
      emailLabel = "Email";
      displayedNameLabel = "Displayed username";
      createUserAuth();
      createUserInDB();
    }
  }

  async function createUserAuth() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return error;
  }

  async function createUserInDB() {
    const { error } = await supabase.from("users").insert({
      joined_at: new Date().getTime(),
      url_username: username,
      displayed_username: displayedName,
    });
    console.log(error);
    return error;
  }
</script>

<svelte:head>
  <title>Sign up for an account</title>
</svelte:head>

<header class="flex-center-all">
  <form class="sec-bg-element form" on:submit={signUp}>
    <h2>Create an account 👇</h2>
    <div class="form-element">
      <label
        for="username"
        class={usernameLabel !== "Username" ? "form-error" : ""}
        >{usernameLabel}</label
      >
      <input
        required
        type="text"
        id="username"
        bind:value={username}
        class="user-input"
        placeholder="Username"
      />
    </div>
    <div class="form-element">
      <label
        for="displayed-name"
        class={displayedNameLabel !== "Displayed username" ? "form-error" : ""}
        >{displayedNameLabel}</label
      >
      <input
        required
        type="text"
        id="displayed-name"
        bind:value={displayedName}
        class="user-input"
        placeholder="Displayed name"
      />
    </div>
    <div class="form-element">
      <label for="email" class={emailLabel !== "Email" ? "form-error" : ""}
        >{emailLabel}</label
      >
      <input
        required
        type="email"
        id="email"
        bind:value={email}
        class="user-input"
        placeholder="Email"
      />
    </div>
    <div class="form-element">
      <label
        for="password"
        class={passwordLabel !== "Password" ? "form-error" : ""}
        >{passwordLabel}</label
      >
      <input
        required
        type="password"
        id="password"
        bind:value={password}
        class="user-input"
        placeholder="Password"
      />
    </div>
    <p class="less">
      Already have an account? <a href="/login">Login</a>.
    </p>
    <button type="submit" class="user-input button-element primary-button"
      >Create account!</button
    >
  </form>
</header>
