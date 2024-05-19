<script lang="ts">
  import PostPreview from "$lib/components/PostPreview.svelte";
  import TopPostNav from "$lib/components/TopPostNav.svelte";
  import userDbData from "$lib/stores/userDbData";
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost, DBUserData } from "$lib/types/db";
  import { onMount } from "svelte";

  let currDbUser: DBUserData;
  let savedPosts: DBPost[] = [];
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
        }
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

<main class="desktop-nav-margin user-page-wrp">
  <TopPostNav />
  <div class="user-page">
    <h2 class="posts-heading">Saved posts</h2>
    <div class="user-posts">
      {#if loading}
        <p class="no-posts less">Loading...</p>
      {:else if savedPosts && !loading}
        {#if savedPosts.length > 0}
          <div class="post-prevs-grid">
            {#each savedPosts as post}
              <PostPreview
                imageUrl={post.image_urls[0]}
                linkHref={`/posts/${post.id}`}
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
