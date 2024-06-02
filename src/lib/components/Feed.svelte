<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DbPost, DbUser } from "$lib/types/db";
  import { onMount } from "svelte";
  import Post from "./Post.svelte";
  import FeedEnd from "./FeedEnd.svelte";
  import Suggestions from "./Suggestions.svelte";
  import userDbData from "$lib/stores/userDbData";
  import NewPostForm from "./NewPostForm.svelte";

  let posts: DbPost[] = [];
  let isReachedFeedEnd = false;
  let isLoading = false;
  let currDbUser: DbUser;

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

  async function getData() {
    if (isLoading) return;
    isLoading = true;

    const { data } = await supabase
      .from("posts")
      .select()
      .is("replying_to", null)
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

  $: console.log(currDbUser);
</script>

<main class="feed-main desktop-nav-margin">
  <div class="posts-inline-spacing">
    {#if currDbUser !== undefined}
      <NewPostForm />
    {/if}
    {#if posts.length > 0}
      {#each posts as { id, user_id, created_at, image_urls, description, likes }, i}
        {#if currDbUser && i === 5}
          <Suggestions />
        {/if}
        <Post
          {id}
          {user_id}
          {created_at}
          image_urls={image_urls ?? []}
          description={description ?? ""}
          likes={likes ?? []}
          isFeedPost
        />
      {/each}
    {/if}
    {#if isReachedFeedEnd}
      <FeedEnd />
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
