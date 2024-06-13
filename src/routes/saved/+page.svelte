<script lang="ts">
  import Post from "$lib/components/feed/Post.svelte";
  import PostPreview from "$lib/components/feed/PostPreview.svelte";
  import TopPostNav from "$lib/components/feed/TopPostNav.svelte";
  import userDbData from "$lib/stores/userDbData";
  import { supabase } from "$lib/supabaseClient";
  import type { DbPost, DbUser } from "$lib/types/db";
  import { onMount } from "svelte";

  let currDbUser: DbUser;
  let savedPosts: DbPost[] = [];
  let loading: boolean = true;
  let functionLoading = false;

  userDbData.subscribe((val: any) => {
    if (val) {
      currDbUser = val;
      getSavedPosts();
    }
  });

  async function getSavedPosts() {
    if (functionLoading) return;
    functionLoading = true;
    if (currDbUser) {
      const { data: user } = await supabase
        .from("users")
        .select()
        .eq("id", currDbUser.id)
        .single();

      if (user) {
        if (user.saved) {
          savedPosts = [];
          for (let i = 0; i < user.saved.length; i++) {
            const { data } = await supabase
              .from("posts")
              .select()
              .eq("id", user.saved[i])
              .single();
            console.log(data);

            savedPosts = [...savedPosts, data];
            if (i === user.saved.length - 1) loading = false;
          }
        } else loading = false;
      }
    }
    functionLoading = false;
  }

  onMount(() => {
    getSavedPosts();
  });
</script>

<svelte:head>
  <title>Your saved posts</title>
</svelte:head>

<main class="desktop-nav-margin posts-inline-spacing">
  <TopPostNav />
  <div class="w-full">
    <div>
      {#if loading}
        <p class="no-posts less">Loading...</p>
      {:else if savedPosts && !loading}
        {#if savedPosts.length > 0}
          <div class="w-full">
            {#each savedPosts as { id, description, created_at, user_id, likes, image_urls }}
              <Post
                {id}
                {description}
                {created_at}
                {user_id}
                {likes}
                {image_urls}
                isFeedPost
              />
            {/each}
          </div>
        {:else}
          <p class="no-posts less">You didn't save anything yet.</p>
        {/if}
      {/if}
    </div>
  </div>
</main>
