<script lang="ts">
  import "./style.css";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  const navDisallowedLocations = ["login", "signup"];
  let nav = true;
  page.subscribe((val: any) => {
    if (browser) {
      nav = !navDisallowedLocations.includes(
        val.url.pathname.replaceAll("/", ""),
      );
    }
  });
</script>

{#if browser && nav}
  <Nav />
{/if}
<slot />
<Footer />
