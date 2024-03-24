<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import NewIcon from "$lib/components/icons/NewIcon.svelte";
  import UserIcon from "$lib/components/icons/UserIcon.svelte";
  import userDbData from "$lib/stores/user-db-data";
  let menuVisible = false;
  let currDbUser: any;
  let locationHref = browser && location.pathname;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
  }

  userDbData.subscribe((val: any) => {
    val && (currDbUser = val);
  });

  browser &&
    document.addEventListener("click", () => {
      menuVisible = false;
    });

  function menu() {
    menuVisible = !menuVisible;
  }
</script>

{#if currDbUser}
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
      <a href="/search" class="button-link nav-button">
        <SearchIcon iconClass="icon nav-menu-icon" /></a
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
        href={`/${currDbUser.url_username ? currDbUser.url_username : ""}`}
        class="button-link nav-button"
      >
        <UserIcon
          iconClass={`icon nav-menu-icon ${locationHref === currDbUser?.url_username ? "nav-icon-current" : ""}`}
        /></a
      >
    </div>
    <div class="menu-button-wrp nav-side">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn"
      >
        <MenuIcon iconClass="icon nav-menu-icon" /></button
      >
      <div class={`dots-menu ${menuVisible ? "dots-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <button class="menu-link" on:click={signOut}>Sign out</button>
      </div>
    </div>
  </nav>
  <!-- MOBILE USER -->
  <nav class="mobile-nav">
    <a href="/feed" class="button-link nav-button">
      <HomeIcon iconClass="icon nav-menu-icon" />
      <span class="mobile-nav-btn-text">Home</span></a
    >
    <a href="/search" class="button-link nav-button">
      <SearchIcon iconClass="icon nav-menu-icon" />
      <span class="mobile-nav-btn-text">Search</span></a
    >
    <a href="/new" class="button-link nav-button">
      <NewIcon iconClass="icon nav-menu-icon" />
      <span class="mobile-nav-btn-text">Create</span>
    </a>
    <a href="/chat" class="button-link nav-button">
      <MessageIcon iconClass="icon nav-menu-icon" />
      <span class="mobile-nav-btn-text">Chats</span></a
    >
    <a
      href={`/${currDbUser.url_username ? currDbUser.url_username : ""}`}
      class="button-link nav-button"
    >
      <UserIcon iconClass="icon nav-menu-icon" />
      <span class="mobile-nav-btn-text">Profile</span></a
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
      <a href="/search" class="button-link nav-button">
        <SearchIcon iconClass="icon nav-menu-icon" /></a
      >
    </div>
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn"
      >
        <MenuIcon iconClass="icon nav-menu-icon" /></button
      >
      <div class={`dots-menu ${menuVisible ? "dots-menu-visible" : ""}`}>
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
    <a href="/search" class="button-link nav-button">
      <SearchIcon iconClass="icon nav-menu-icon" /></a
    >
    <div class="menu-button-wrp">
      <button
        on:click={(e) => {
          e.stopPropagation();
          menu();
        }}
        class="button-link nav-button no-bg-nav-btn"
      >
        <MenuIcon iconClass="icon nav-menu-icon" /></button
      >
      <div class={`dots-menu ${menuVisible ? "dots-menu-visible" : ""}`}>
        <a href="/about" class="menu-link">About Futuregram</a>
        <a href="/login" class="menu-link">Login</a>
      </div>
    </div>
  </nav>
{/if}
