<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  import { browser } from "$app/environment";

  let currLoggedInUser: any;
  let currUserDbData: any;

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
    browser && val === null && (location.href = "/signup");
  });

  userDbData.subscribe((val: any) => {
    currUserDbData = val;
  });
</script>

<svelte:head>
  <title>Your settings</title>
</svelte:head>

<main>
  <h1>User settings</h1>
</main>
