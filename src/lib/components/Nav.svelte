<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  let menuVisible = false;
  let currentUser: string;
  // needs to be dynamic, just a placeholder rn
  let urlUsername = "honzoraptor";

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
    currentUser = "";
  }

  async function authListener() {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);

      if (event === "SIGNED_IN") {
        checkUser();
      } else if (event === "SIGNED_OUT") {
        currentUser = "";
      }
    });
  }

  async function checkUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    currentUser = user?.user_metadata.name;
  }

  authListener();

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      currentUser = user.user_metadata.name;
    }
  }
  getUser();

  function search() {
    console.log("Search function");
  }

  browser &&
    document.addEventListener("click", () => {
      menuVisible = false;
    });

  function menu() {
    menuVisible = !menuVisible;
  }
</script>

{#if currentUser}
  <!-- DESKTOP -->
  <nav class="desktop-nav">
    <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon iconClass="icon mobile-menu-icon" /></a
      >
      <button on:click={search} class="button-link nav-button">
        <SearchIcon iconClass="icon mobile-menu-icon" /></button
      >
      <a href="/chat" class="button-link nav-button">
        <MessageIcon iconClass="icon mobile-menu-icon" /></a
      >
    </div>
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon mobile-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href={`${urlUsername ? urlUsername : ""}`} class="menu-link"
          >My profile</a
        >
        <button class="menu-link" on:click={signOut}>Sign out</button>
      </div>
    </div>
  </nav>
  <!-- MOBILE -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon iconClass="icon mobile-menu-icon" /></a
    >
    <button on:click={search} class="button-link nav-button">
      <SearchIcon iconClass="icon mobile-menu-icon" /></button
    >
    <a href="/chat" class="button-link nav-button">
      <MessageIcon iconClass="icon mobile-menu-icon" /></a
    >
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon mobile-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <button class="menu-link" on:click={signOut}>Sign out</button>
      </div>
    </div>
  </nav>
{:else}
  <!-- DESKTOP -->
  <nav class="desktop-nav">
    <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon iconClass="icon mobile-menu-icon" /></a
      >
      <button on:click={search} class="button-link nav-button">
        <SearchIcon iconClass="icon mobile-menu-icon" /></button
      >
    </div>
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon mobile-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href="/login" class="menu-link">Login</a>
      </div>
    </div>
  </nav>

  <!-- MOBILE -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon iconClass="icon mobile-menu-icon" /></a
    >
    <button on:click={search} class="button-link nav-button">
      <SearchIcon iconClass="icon mobile-menu-icon" /></button
    >
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon mobile-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href="/login" class="menu-link">Login</a>
      </div>
    </div>
  </nav>
{/if}
