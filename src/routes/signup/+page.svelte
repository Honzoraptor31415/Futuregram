<script>
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let password = "";
  let username = "";
  let displayedName = "";
  const allowedUsernameChars = "abcdefghijklmnopqrstuvwxyz";
  const disallowedUsernames = ["feed", "login", "signup", "chat", "about"];
  function signUp() {
    console.log(
      `Sign up function\nEmail: ${email}\nPassword: ${password}\nUsername: ${username}\nDisplayed username: ${displayedName}`,
    );
  }
</script>

<svelte:head>
  <title>Sign up for an account</title>
</svelte:head>

<header class="flex-center-all">
  <form class="sec-bg-element form" on:submit={signUp}>
    <h2>Create an account 👇</h2>
    <div class="form-element">
      <label for="username">Username</label>
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
      <label for="displayed-name">Displayed username</label>
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
      <!-- .form-error = error class -->
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
      Already have an account? <a href="/login">Login</a>.
    </p>
    <button type="submit" class="user-input button-element primary-button"
      >Create account!</button
    >
  </form>
</header>