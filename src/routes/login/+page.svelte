<script lang="ts">
  import { browser } from "$app/environment";
  import * as validation from "$lib/helper/formValidation";
  import FormElement from "$lib/components/forms/FormElement.svelte";
  import { supabase } from "$lib/supabaseClient";

  let email = "";
  let password = "";
  let emailLabel = "";
  let passwordLabel = "";

  async function emailPassworLogin() {
    email = email.trim().toLowerCase();

    emailLabel = validation.emailCheck(email).message;
    passwordLabel = validation.passwordCheck(password).message;

    if (
      validation.emailCheck(email).isValid &&
      validation.passwordCheck(password).isValid
    ) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      switch (error?.status) {
        case 400:
          emailLabel = "No match";
          passwordLabel = "No match";
          break;

        default:
          break;
      }
      !error && browser && (location.href = "/");
    }
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
  <title>Login</title>
</svelte:head>

<header class="flex-center-all">
  <form
    class="sec-bg-element form-width-set form login-form no-nav"
    on:submit={emailPassworLogin}
  >
    <h2>Welcome back!</h2>
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
      <div class="line-horizontal"></div>
      <p class="less login-or">or</p>
      <div class="line-horizontal"></div>
    </div>
    <FormElement
      id="email"
      labelClass="no-tp"
      initLabel="Email"
      placeholder="Email"
      label={emailLabel}
      bind:value={email}
      isValid={emailLabel === ""}
    />
    <FormElement
      id="password"
      initLabel="Password"
      placeholder="Password"
      type="password"
      label={passwordLabel}
      bind:value={password}
      isValid={passwordLabel === ""}
    />
    <p class="less">
      Don't have an account yet? <a href="/signup">Sign up</a> for one.
    </p>
    <button type="submit" class="user-input button-element primary-button"
      >Login</button
    >
  </form>
</header>
