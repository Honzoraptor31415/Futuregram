<script>
  import { browser } from "$app/environment";
  import Error from "$lib/components/Error.svelte";
  let error = false;
  let postID = "";
  if (browser) {
    postID = location.search.split("=")[1];
  }
</script>

<svelte:head>
  <title>Your feed</title>
</svelte:head>

{#if error}
  <Error code={404} message="Post was not found." />
{:else if !postID}
  <main>
    <h1>Feed</h1>
  </main>
{:else}
  <main>
    <h1>Post</h1>
  </main>
{/if}
