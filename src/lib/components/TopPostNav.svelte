<script lang="ts">
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
  import MenuIcon from "./icons/MenuIcon.svelte";
  import HiddenMenu from "./HiddenMenu.svelte";
  import type { AuthUser } from "$lib/types/auth";
  import type { DbUser } from "$lib/types/db";
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import { browser } from "$app/environment";

  export let showMenu = false;

  let currUser: AuthUser;
  let currDbUser: DbUser;

  loggedInUser.subscribe((val: any) => {
    val !== null && (currUser = val);
  });

  userDbData.subscribe((val: any) => {
    val && (currDbUser = val);
  });

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

  async function reportUser() {
    console.log("Report user function");
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    !error && browser && (location.href = "/login");
  }

  function historyStep(step: string) {
    switch (step) {
      case "back":
        history.back();
        break;

      default:
        console.log("Invalid step");
        break;
    }
  }
</script>

<nav class="mobile-top-nav">
  <button
    on:click={() => {
      historyStep("back");
    }}
    class="grid-wrp no-style mobile-top-btn btn-active-opacity"
  >
    <ArrowLeftIcon iconClass="top-nav-icon" />
  </button>

  {#if showMenu}
    <HiddenMenu
      btnClass="grid-wrp no-style mobile-top-btn btn-active-opacity"
      icon={MenuIcon}
      iconClass="top-nav-icon"
      wrpClass="dots-menu right-25"
      wrpClassVis="dots-menu-visible"
      wrpClassHid=""
      elements={currUser ? loggedInMenuElements : guestMenuElements}
    />
  {/if}
</nav>
