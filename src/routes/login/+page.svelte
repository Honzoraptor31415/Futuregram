<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";

  loggedInUser.subscribe((val) => {
    browser && val && (location.href = "/feed");
  });
  let email = "";
  let password = "";
  let emailLabel = "";
  let passwordLabel = "";
  let type = "password";

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

  async function emailPassworLogin() {
    email = email.trim().toLowerCase();
    emailCheck();
    passwordCheck();
    if (emailCheck() && passwordCheck()) {
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
      !error && browser && (location.href = "/feed");
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

  function setShowPassword() {
    if (type === "password") {
      type = "text";
    } else {
      type = "password";
    }
  }

  const handleInput = (e: any) => {
    password = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value;
  };
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
      <div class="line"></div>
      <p class="less login-or">or</p>
      <div class="line"></div>
    </div>
    <div class="form-element">
      <label
        for="email"
        class={`no-tp ${emailLabel !== "" ? "form-error" : ""}`}
        >{emailLabel === "" ? "Email" : emailLabel}</label
      >
      <input
        type="text"
        id="email"
        bind:value={email}
        class={`user-input user-input-text ${emailLabel !== "" ? "form-error-input" : ""}`}
        placeholder="E-mail"
      />
    </div>
    <div class="form-element">
      <label for="password" class={passwordLabel !== "" ? "form-error" : ""}
        >{passwordLabel === "" ? "Password" : passwordLabel}</label
      >
      <div
        class={`user-input-text password-input-wrp ${passwordLabel !== "" ? "form-error-input" : ""}`}
      >
        <input
          {type}
          id="password"
          on:input={handleInput}
          class="password-input no-style"
          placeholder="Password"
        />
        {#if password}
          <button
            type="button"
            class="no-style before-hover-anim password-show-button"
            on:click={setShowPassword}
          >
            {#if type === "text"}
              <HideIcon iconClass="image-height-30" />
            {:else}
              <ShowIcon iconClass="image-height-30" />
            {/if}
          </button>
        {/if}
      </div>
    </div>
    <p class="less">
      Don't have an account yet? <a href="/signup">Sign up</a> for one.
    </p>
    <button type="submit" class="user-input button-element primary-button"
      >Login</button
    >
  </form>
</header>
