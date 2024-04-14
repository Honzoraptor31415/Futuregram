<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost } from "$lib/types/db";
  import Post from "./Post.svelte";

  let posts: DBPost[];
  let noPosts = false;

  async function getPosts() {
    const { data } = await supabase.from("posts").select();
    if (data) {
      data
        .sort((a, b) => {
          return a.likes.length - b.likes.length;
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
        <Post postID={id} feedPost={true} />
      {/each}
    {:else if noPosts}
      <h1>No posts</h1>
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
