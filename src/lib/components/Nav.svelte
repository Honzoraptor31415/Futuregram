<script lang="ts">
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import NewIcon from "$lib/components/icons/NewIcon.svelte";
  import UserIcon from "$lib/components/icons/UserIcon.svelte";
  import userDbData, { userLoaded } from "$lib/stores/userDbData";
  import { page } from "$app/stores";
  import HiddenMenu from "$lib/components/HiddenMenu.svelte";
  import type { DbUser } from "$lib/types/db";
  import { supabase } from "$lib/supabaseClient";

  let currDbUser: DbUser;
  let locationHref = browser && location.pathname.replaceAll("/", "");
  let userIsLoaded = false;

  const loggedInMenuElements = [
    {
      class: "menu-link",
      type: "link",
      text: "Settings",
      href: "/settings",
    },
    {
      class: "menu-link",
      type: "link",
      text: "Saved posts",
      href: "/saved",
    },
    {
      class: "menu-link",
      type: "link",
      text: "About Futuregram",
      href: "/about",
    },
    {
      class: "menu-link",
      type: "button",
      text: "Sign out",
      onClick: signOut,
    },
  ];

  const guestMenuElements = [
    {
      type: "link",
      class: "menu-link",
      text: "About Futuregram",
      href: "/about",
    },
    {
      type: "link",
      class: "menu-link",
      text: "Login",
      href: "/login",
    },
  ];

  page.subscribe((val: any) => {
    locationHref = val.url.pathname.replaceAll("/", "");
  });

  userDbData.subscribe((val: any) => {
    console.log(val);

    currDbUser = val;
  });

  userLoaded.subscribe((val: any) => {
    userIsLoaded = val;
  });

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
  }
</script>

{#if userIsLoaded && currDbUser}
  <!-- DESKTOP USER -->
  <nav class="desktop-nav">
    <div class="nav-side grid-parent">
      <a href="/#" class="logo-nav-text gradient-text no-select">Futuregram</a>
    </div>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon
          iconClass={`icon nav-menu-icon ${locationHref === "" ? "nav-icon-current" : ""}`}
        /></a
      >
      <a href="/search" class="button-link nav-button">
        <SearchIcon
          iconClass={`icon nav-menu-icon ${locationHref === "search" ? "nav-icon-current" : ""}`}
        /></a
      >
      <a href="/?new" class="button-link nav-button">
        <NewIcon
          iconClass={`icon nav-menu-icon ${locationHref === "new" ? "nav-icon-current" : ""}`}
        />
      </a>
      <a href="/chat" class="button-link nav-button">
        <MessageIcon
          iconClass={`icon nav-menu-icon ${locationHref === "chat" ? "nav-icon-current" : ""}`}
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
      <HiddenMenu
        icon={MenuIcon}
        iconClass="icon nav-menu-icon"
        wrpClass="dots-menu"
        btnClass="button-link nav-button no-bg-nav-btn"
        wrpClassVis="dots-menu-visible"
        wrpClassHid=""
        elements={loggedInMenuElements}
      />
    </div>
  </nav>
  <!-- MOBILE USER -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon
        iconClass={`icon nav-menu-icon ${locationHref === "" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/search" class="button-link nav-button">
      <SearchIcon
        iconClass={`icon nav-menu-icon ${locationHref === "search" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/?new" class="button-link nav-button">
      <NewIcon
        iconClass={`icon nav-menu-icon ${locationHref === "new" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/chat" class="button-link nav-button">
      <MessageIcon
        iconClass={`icon nav-menu-icon ${locationHref === "chat" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a
      href={`/${currDbUser.url_username ? currDbUser.url_username : ""}`}
      class="button-link nav-button"
    >
      <UserIcon
        iconClass={`icon nav-menu-icon ${locationHref === currDbUser?.url_username ? "nav-icon-current" : ""}`}
      />
    </a>
  </nav>
{:else if userIsLoaded}
  <!-- DESKTOP GUEST -->
  <nav class="desktop-nav">
    <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon
          iconClass={`icon nav-menu-icon ${locationHref === "" ? "nav-icon-current" : ""}`}
        /></a
      >
      <a href="/search" class="button-link nav-button">
        <SearchIcon
          iconClass={`icon nav-menu-icon ${locationHref === "search" ? "nav-icon-current" : ""}`}
        /></a
      >
      <a href="/login" class="button-link nav-button">
        <UserIcon iconClass="icon nav-menu-icon" /></a
      >
    </div>
    <div class="menu-button-wrp">
      <HiddenMenu
        btnClass="button-link nav-button no-bg-nav-btn"
        icon={MenuIcon}
        wrpClass="dots-menu"
        wrpClassVis="dots-menu-visible"
        wrpClassHid=""
        iconClass="icon nav-menu-icon"
        elements={guestMenuElements}
      />
    </div>
  </nav>

  <!-- MOBILE GUEST -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon
        iconClass={`icon nav-menu-icon ${locationHref === "" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/search" class="button-link nav-button">
      <SearchIcon
        iconClass={`icon nav-menu-icon ${locationHref === "search" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/login" class="button-link nav-button">
      <UserIcon iconClass="icon nav-menu-icon" />
    </a>
  </nav>
{/if}
