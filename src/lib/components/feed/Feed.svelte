<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { DbPost, DbUser } from "$lib/types/db";
  import { onMount } from "svelte";
  import Post from "./Post.svelte";
  import FeedEnd from "./FeedEnd.svelte";
  import Suggestions from "./Suggestions.svelte";
  import userDbData from "$lib/stores/userDbData";
  import NewPostForm from "../forms/NewPostForm.svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import type { AuthUser } from "$lib/types/auth";

  let posts: DbPost[] = [];
  let isReachedFeedEnd = false;
  let isLoading = false;
  let currDbUser: DbUser;
  let isPostsLoaded = false;
  let currUser: AuthUser;

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

  loggedInUser.subscribe((val: any) => {
    currUser = val;
  });

  async function getData() {
    if (isLoading) return;
    isLoading = true;

    const { data } = await supabase
      .from("posts")
      .select()
      .is("replying_to", null)
      .range(posts.length, posts.length + 3);

    if (data) {
      data.length > 0
        ? (posts = [...posts, ...data])
        : (isReachedFeedEnd = true);

      isPostsLoaded = true;
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
    };
  });

  $: if ($page.url.search === "?new" && browser) {
    setTimeout(() => {
      const textareaElement = document.querySelector(
        ".create-post-input"
      ) as HTMLTextAreaElement;
      textareaElement?.focus();
    }, 0);
  }

  $: console.log(currDbUser, isPostsLoaded, currUser);
</script>

<main
  class="feed-main desktop-nav-margin {posts.length < 1 ? 'no-posts-feed' : ''}"
>
  <div class="posts-inline-spacing">
    <div class="flex-center-all mobile">
      <a
        href="/#"
        class="gradient-text logo-nav-text text-center no-select mobile-feed-heading"
      >
        Futuregram
      </a>
    </div>
    {#if currDbUser && currUser}
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
    {:else if posts.length < 1 && isPostsLoaded && currDbUser !== undefined}
      <div class="flex-center-all m-block-auto no-posts-dialog">
        <div class="flex-column gap-10 align-center">
          <h2>Looks like there aren't any posts yet!</h2>
          {#if currDbUser && currUser}
            <a
              href="/?new"
              class="button-element primary-button user-page-input"
              >Create the first one!</a
            >
          {:else}
            <p class="less"><a href="/login">Sign in</a> to create one.</p>
          {/if}
        </div>
      </div>
    {/if}
    {#if isReachedFeedEnd && posts.length > 1}
      <FeedEnd />
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
