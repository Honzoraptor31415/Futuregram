<script lang="ts">
  import Post from "$lib/components/feed/Post.svelte";
  import PostPreview from "$lib/components/feed/PostPreview.svelte";
  import TopPostNav from "$lib/components/feed/TopPostNav.svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";
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

      if (user?.saved) {
        savedPosts = [];
        for (let i = 0; i < user.saved.length; i++) {
          const { data } = await supabase
            .from("posts")
            .select()
            .eq("id", user.saved[i])
            .single();

          savedPosts = [...savedPosts, data].filter((val) => val !== null);
          let updatedSavedPostsIds = savedPosts.map(({ id }) => id);

          if (updatedSavedPostsIds !== user.saved) {
            await supabase
              .from("users")
              .update({
                saved: updatedSavedPostsIds,
              })
              .eq("id", currDbUser.id);
          }

          if (i === user.saved.length - 1) loading = false;
        }
      } else loading = false;
    }
    functionLoading = false;
  }

  onMount(() => {
    getSavedPosts();
  });

  $: console.log(savedPosts);
</script>

<svelte:head>
  <title>Your saved posts</title>
</svelte:head>

{#if loading}
  <header class="flex-center-all">
    <Spinner size={70} />
  </header>
{:else if savedPosts && !loading}
  {#if savedPosts.length > 0}
    <main class="desktop-nav-padding posts-inline-spacing">
      <TopPostNav />
      <div class="w-full">
        <div>
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
        </div>
      </div>
    </main>
  {:else}
    <p class="no-posts less">You didn't save anything yet.</p>
  {/if}
{/if}
