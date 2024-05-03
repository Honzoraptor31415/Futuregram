<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost } from "$lib/types/db";
  import Post from "./Post.svelte";

  let posts: DBPost[];

  async function getData() {
    const { data } = await supabase.from("posts").select();
    data && (posts = data);
  }

  getData();
</script>

<main class="feed-main desktop-nav-margin">
  <div class="posts-inline-spacing">
    {#if posts && posts.length > 0}
      {#each posts as { id, created_at, image_url, title, description, likes, user_id }}
        <Post
          {id}
          {user_id}
          {created_at}
          {image_url}
          {title}
          {description}
          {likes}
          feedPost={true}
        />
      {/each}
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
