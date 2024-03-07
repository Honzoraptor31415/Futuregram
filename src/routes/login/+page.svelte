<script>
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let password = "";
  function emailPassworLogin() {
    console.log(
      `Email/password login function\nEmail: ${email}\nPassword: ${password}`,
    );
  }

  function googleSignIn() {
    console.log("Google sign in");
  }

  function githubSignIn() {
    console.log("Github sign in");
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<header class="flex-center-all">
  <form class="sec-bg-element form" on:submit={emailPassworLogin}>
    <h2>Welcome back!</h2>
    <div class="other-login-wrp">
      <button type="button" on:click={googleSignIn} class="other-login"
        >Continue with<img
          src="google-icon.svg"
          alt="Google icon"
          class="other-login-icon"
        /></button
      >
      <button type="button" on:click={githubSignIn} class="other-login"
        >Continue with<img
          src="github-icon.svg"
          alt="Github icon"
          class="other-login-icon"
        /></button
      >
    </div>
    <div class="login-line-wrp">
      <div class="line"></div>
      <p class="less login-or">or</p>
      <div class="line"></div>
    </div>
    <div class="form-element">
      <label for="email">Email</label>
      <input
        required
        type="email"
        id="email"
        bind:value={email}
        class="user-input"
        placeholder="E-mail"
      />
    </div>
    <div class="form-element">
      <label for="password">Password</label>
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
      Don't have an account yet? <a href="/signup">Sign up</a> for one.
    </p>
    <button type="submit" class="user-input primary-button">Login</button>
  </form>
</header>
