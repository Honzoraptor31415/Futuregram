<script>
  import { browser } from "$app/environment";
  import Error from "$lib/components/Error.svelte";
  let error = false;
  let postID = "";
  if (browser) {
    postID = location.search.split("=")[1];
  }
</script>

{#if error}
  <Error code={404} message="Post was not found." />
{:else if !postID}
  <h1>Feed</h1>
{:else}
  <h1>Post</h1>
{/if}
