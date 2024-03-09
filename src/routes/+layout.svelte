<script lang="ts">
  import "./style.css";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  const navDisallowedLocations = ["/login", "/signup", "/finish-oauth-signup"];
  let noNav = true;
  if (browser) {
    noNav = !navDisallowedLocations.includes(location.pathname);
  }
</script>

{#if browser && noNav}
  <Nav />
{/if}
<slot />
<Footer />
