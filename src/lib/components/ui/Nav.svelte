<script lang="ts">
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import NewIcon from "$lib/components/icons/NewIcon.svelte";
  import UserIcon from "$lib/components/icons/UserIcon.svelte";
  import userDbData from "$lib/stores/userDbData";
  import { page } from "$app/stores";
  import HiddenMenu from "$lib/components/ui/HiddenMenu.svelte";
  import type { DbUser } from "$lib/types/db";
  import { signOut } from "$lib/helper/supabase";

  let currDbUser: DbUser;
  let locationHref = browser && location.pathname.replaceAll("/", "");

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
    currDbUser = val;
  });
</script>

{#if currDbUser}
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
      <a href="/?new#new-post-form" class="button-link nav-button">
        <NewIcon
          iconClass={`icon nav-menu-icon ${locationHref === "new" ? "nav-icon-current" : ""}`}
        />
      </a>
      <a href="/messages" class="button-link nav-button">
        <MessageIcon
          iconClass={`icon nav-menu-icon ${locationHref === "messages" ? "nav-icon-current" : ""}`}
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
    <a href="/?new#new-post-form" class="button-link nav-button">
      <NewIcon
        iconClass={`icon nav-menu-icon ${locationHref === "new" ? "nav-icon-current" : ""}`}
      />
    </a>
    <a href="/messages" class="button-link nav-button">
      <MessageIcon
        iconClass={`icon nav-menu-icon ${locationHref === "messages" ? "nav-icon-current" : ""}`}
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
{:else if currDbUser === null}
  <!-- DESKTOP GUEST -->
  <nav class="desktop-nav">
    <div class="grid-parent nav-side">
      <a href="/#" class="logo-nav-text gradient-text">Futuregram</a>
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
      <a href="/login" class="button-link nav-button">
        <UserIcon iconClass="icon nav-menu-icon" /></a
      >
    </div>
    <div class="menu-button-wrp nav-side">
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
