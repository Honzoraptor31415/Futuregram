<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  loggedInUser.subscribe((val) => {
    browser && !val && (location.href = "/signup");
  });
</script>

<svelte:head>
  <title>Create a post on Futuregram</title>
</svelte:head>

<main>
  <h1>Create new post</h1>
</main>
