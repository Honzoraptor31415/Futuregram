<script>
  import "./style.css";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";
  const navAllowedLocations = ["/about", "/feed", "/chat"];
</script>

{#if browser && navAllowedLocations.includes(location.pathname)}
  <Nav />
{/if}
<slot />
<Footer />
