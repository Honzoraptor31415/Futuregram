<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DBPost, DBUserData } from "$lib/types/db";
  import { onMount } from "svelte";
  import Post from "./Post.svelte";
  import FeedEnd from "./FeedEnd.svelte";
  import Suggestions from "./Suggestions.svelte";
  import userDbData from "$lib/stores/userDbData";
  import NewPostForm from "./NewPostForm.svelte";

  let posts: DBPost[] = [];
  let isReachedFeedEnd = false;
  let isLoading = false;
  let currDbUser: DBUserData;

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

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
    {#if currDbUser}
      <NewPostForm />
    {/if}
    {#if posts.length > 0}
      {#each posts as post}
        {#if currDbUser && posts.indexOf(post) === 5}
          <Suggestions />
        {/if}
        <Post
          id={post.id}
          user_id={post.user_id}
          created_at={post.created_at}
          image_urls={post.image_urls}
          description={post.description}
          likes={post.likes}
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
