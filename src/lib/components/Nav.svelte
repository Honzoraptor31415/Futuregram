<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import NewIcon from "$lib/components/icons/NewIcon.svelte";
  import UserIcon from "$lib/components/icons/UserIcon.svelte";
  import loggedInUser from "$lib/stores/user";
  let menuVisible = false;
  let currentUser: any;
  let locationHref = browser && location.pathname;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
  }

  loggedInUser.subscribe((val: any) => {
    if (val) {
      currentUser = val;
      getDbUser(val.user_metadata.db_id);
    }
  });

  async function getDbUser(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    data && (currentUser = data[0]);
  }

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
  <!-- DESKTOP USER -->
  <nav class="desktop-nav">
    <div class="nav-side grid-parent">
      <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
    </div>
    <div class="nav-btns">
      <a href="/feed" class="button-link nav-button">
        <HomeIcon
          iconClass={`icon nav-menu-icon ${locationHref === "/feed" ? "nav-icon-current" : ""}`}
        /></a
      >
      <button on:click={search} class="button-link nav-button">
        <SearchIcon iconClass="icon nav-menu-icon" /></button
      >
      <a href="/new" class="button-link nav-button">
        <NewIcon
          iconClass={`icon nav-menu-icon ${locationHref === "/new" ? "nav-icon-current" : ""}`}
        />
      </a>
      <a href="/chat" class="button-link nav-button">
        <MessageIcon
          iconClass={`icon nav-menu-icon ${locationHref === "/chat" ? "nav-icon-current" : ""}`}
        /></a
      >
      <a
        href={`/${currentUser.url_username ? currentUser.url_username : ""}`}
        class="button-link nav-button"
      >
        <UserIcon
          iconClass={`icon nav-menu-icon ${locationHref === currentUser?.url_username ? "nav-icon-current" : ""}`}
        /></a
      >
    </div>
    <div class="menu-button-wrp nav-side">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon nav-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <button class="menu-link" on:click={signOut}>Sign out</button>
      </div>
    </div>
  </nav>
  <!-- MOBILE USER -->
  <nav class="mobile-nav">
    <a href="/feed" class="button-link nav-button">
      <HomeIcon iconClass="icon nav-menu-icon" /></a
    >
    <button on:click={search} class="button-link nav-button">
      <SearchIcon iconClass="icon nav-menu-icon" /></button
    >
    <a href="/new" class="button-link nav-button">
      <NewIcon iconClass="icon nav-menu-icon" />
    </a>
    <a href="/chat" class="button-link nav-button">
      <MessageIcon iconClass="icon nav-menu-icon" /></a
    >
    <a
      href={`/${currentUser.url_username ? currentUser.url_username : ""}`}
      class="button-link nav-button"
    >
      <UserIcon iconClass="icon nav-menu-icon" /></a
    >
  </nav>
{:else}
  <!-- DESKTOP GUEST -->
  <nav class="desktop-nav">
    <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon iconClass="icon nav-menu-icon" /></a
      >
      <button on:click={search} class="button-link nav-button">
        <SearchIcon iconClass="icon nav-menu-icon" /></button
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
        <MenuIcon iconClass="icon nav-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href="/login" class="menu-link">Login</a>
      </div>
    </div>
  </nav>

  <!-- MOBILE GUEST -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon iconClass="icon nav-menu-icon" /></a
    >
    <button on:click={search} class="button-link nav-button">
      <SearchIcon iconClass="icon nav-menu-icon" /></button
    >
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn nav-will-stay"
      >
        <MenuIcon iconClass="icon nav-menu-icon nav-will-stay" /></button
      >
      <div class={`nav-menu ${menuVisible ? "nav-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href="/login" class="menu-link">Login</a>
      </div>
    </div>
  </nav>
{/if}
