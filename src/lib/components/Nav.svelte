<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  import HomeIcon from "$lib/components/icons/HomeIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  let currentUser: string;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (browser) {
      window.location.href = "/login";
    }
    currentUser = "";
  }

  async function getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user !== null) {
      currentUser = user.user_metadata.name;
    }
  }
  getUser();

  function search() {
    console.log("Search function");
  }

  function menu() {
    console.log("Menu function");
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
    <button on:click={menu} class="button-link nav-button no-bg-nav-btn">
      <MenuIcon iconClass="icon mobile-menu-icon" /></button
    >
  </nav>
  <!-- MOBILE -->
  <nav class="mobile-nav">
    <a href="/" class="button-link nav-button">
      <HomeIcon iconClass="icon mobile-menu-icon" /></a
    >
    <button on:click={search} class="button-link nav-button">
      <SearchIcon iconClass="icon mobile-menu-icon" /></button
    >
    <button on:click={menu} class="button-link nav-button">
      <MenuIcon iconClass="icon mobile-menu-icon" /></button
    >
  </nav>
{:else}
  <!-- DESKTOP -->
  <nav class="desktop-nav">
    <p class="user-nav-indicator">Not logged in</p>
    <div class="nav-btns">
      <a href="/" class="button-link nav-button">
        <HomeIcon iconClass="icon mobile-menu-icon" /></a
      >
      <button on:click={search} class="button-link nav-button">
        <SearchIcon iconClass="icon mobile-menu-icon" /></button
      >
    </div>
    <button on:click={menu} class="button-link nav-button no-bg-nav-btn">
      <MenuIcon iconClass="icon mobile-menu-icon" /></button
    >
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
    <button on:click={menu} class="button-link nav-button">
      <MenuIcon iconClass="icon mobile-menu-icon" /></button
    >
  </nav>
{/if}
