<script lang="ts">
  import * as validation from "$lib/helper/formValidation";
  import FormElement from "$lib/components/FormElement.svelte";
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
  let verifyEmail = false;

  async function signUp() {
    username = username.trim();
    displayedName = displayedName.trim();
    email = email.trim().toLowerCase();
    bio = bio.trim();

    usernameLabel = await validation.usernameCheck(username);
    displayedNameLabel = validation.displayedNameCheck(displayedName);
    emailLabel = validation.emailCheck(email);
    passwordLabel = validation.passwordCheck(password);
    bioLabel = validation.bioCheck(bio);

    if (
      usernameLabel === "" &&
      displayedNameLabel === "" &&
      emailLabel === "" &&
      passwordLabel === "" &&
      bioLabel === ""
    ) {
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
    <form class="sec-bg-element form no-nav signup-form" on:submit={signUp}>
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
        <FormElement
          id="username"
          labelClass="no-tp"
          initLabel="Username"
          required={true}
          starClass="left-0"
          placeholder="Username"
          label={usernameLabel}
          bind:value={username}
        />
        <FormElement
          id="displayed-name"
          labelClass="no-tp"
          initLabel="Displayed username"
          required={true}
          starClass="left-0"
          placeholder="Displayed name"
          label={displayedNameLabel}
          bind:value={displayedName}
        />
        <FormElement
          id="email"
          initLabel="Email"
          required={true}
          starClass="left-0"
          placeholder="Email"
          label={emailLabel}
          bind:value={email}
        />
        <FormElement
          id="password"
          initLabel="Password"
          required={true}
          starClass="left-0"
          placeholder="Password"
          label={passwordLabel}
          bind:value={password}
          type="password"
        />
      </div>
      <FormElement
        id="bio"
        initLabel="Bio"
        required={true}
        starClass="left-0"
        placeholder="Your bio"
        label={bioLabel}
        bind:value={bio}
        wrpClass="w-full"
        type="textarea"
      />
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
        We sent you an email at <b>{email}</b>. All you have to do is click the
        link in the email!
      </p>
    </div>
  {/if}
</header>
