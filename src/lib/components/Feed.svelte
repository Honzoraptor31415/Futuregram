<script lang="ts">
  import type { DBPost } from "$lib/types/db";
  import Post from "./Post.svelte";

  export let posts: DBPost[];
  export let noPosts = false;
</script>

<main class="feed-main desktop-nav-margin">
  <div class="feed-posts-wrp">
    {#if posts && !noPosts}
      {#each posts as { id }}
        <Post postID={id} feedPost={true} />
      {/each}
    {:else if noPosts}
      <h1>No posts</h1>
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
