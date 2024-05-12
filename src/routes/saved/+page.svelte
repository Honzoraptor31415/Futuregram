<script lang="ts">
  import { page } from "$app/stores";
  import PostPreview from "$lib/components/PostPreview.svelte";
  import userDbData from "$lib/stores/user-db-data";
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost, DBUserData } from "$lib/types/db";

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

  page.subscribe((val: any) => {
    getSavedPosts();
  });

  async function getSavedPosts() {
    if (functionLoading) return;
    functionLoading = true;
    if (currDbUser) {
      if (currDbUser.saved) {
        for (let i = 0; i < currDbUser.saved.length; i++) {
          const { data } = await supabase
            .from("posts")
            .select()
            .eq("id", currDbUser.saved[i])
            .single();
          console.log(data);

          savedPosts = [...savedPosts, data];
          if (i === currDbUser.saved.length - 1) loading = false;
        }
      }
    }
    functionLoading = false;
  }
</script>

<svelte:head>
  <title>Your saved posts</title>
</svelte:head>

<main class="desktop-nav-margin user-page-wrp">
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
                imageUrl={post.image_url}
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
