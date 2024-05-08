<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost } from "$lib/types/db";
  import { onMount } from "svelte";
  import Post from "./Post.svelte";
  import FeedEnd from "./FeedEnd.svelte";

  let posts: DBPost[] = [];
  let isReachedFeedEnd = false;
  let isLoading = false;

  async function getData() {
    if (isLoading) return;
    isLoading = true;

    const { data } = await supabase
      .from("posts")
      .select()
      .range(posts.length, posts.length + 3);

    console.log(data);

    if (data) {
      data.length > 0
        ? (posts = [...posts, ...data])
        : (isReachedFeedEnd = true);
    }
    isLoading = false;
  }

  onMount(() => {
    getData();
    const onscroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight + 50;
      const isReachBottom = document.body.scrollHeight <= scrolledTo;
      isReachBottom && !isReachedFeedEnd && getData();
    };
    document.addEventListener("scroll", onscroll);
    return () => {
      document.removeEventListener("scroll", onscroll);
      console.log("Scroll listener removed");
    };
  });
</script>

<main class="feed-main desktop-nav-margin">
  <div class="posts-inline-spacing">
    {#if posts.length > 0}
      {#each posts as { id, created_at, image_url, title, description, likes, user_id }}
        <Post
          {id}
          {user_id}
          {created_at}
          {image_url}
          {title}
          {description}
          {likes}
          feedPost
        />
      {/each}
    {/if}
    {#if isReachedFeedEnd}
      <FeedEnd />
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
