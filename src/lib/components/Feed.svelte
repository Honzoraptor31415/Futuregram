<script lang="ts">
  import type { DBPost } from "$lib/types/db";
  import Post from "./Post.svelte";

  export let supabase: any;

  let posts: DBPost[];
  let noPosts = false;

  async function getPosts() {
    const { data } = await supabase.from("posts").select();
    if (data) {
      data
        .sort((a: any, b: any) => {
          return a.likes ? a.likes.length : 0 - b.likes ? b.likes.length : 0;
        })
        .reverse();
      posts = data;
    } else {
      noPosts = true;
    }
  }
  getPosts();
</script>

<main class="feed-main desktop-nav-margin">
  <div class="feed-posts-wrp">
    {#if posts && !noPosts}
      {#each posts as { id }}
        <Post {supabase} postID={id} feedPost={true} />
      {/each}
    {:else if noPosts}
      <h1>No posts</h1>
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
