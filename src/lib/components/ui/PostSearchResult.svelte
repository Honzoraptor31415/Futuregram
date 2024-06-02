<script lang="ts">
  import type { DbPost, DbUser } from "$lib/types/db";
  import { onMount } from "svelte";
  import LongHiddenText from "./LongHiddenText.svelte";
  import HeartIcon from "../icons/HeartIcon.svelte";
  import { supabase } from "$lib/supabaseClient";

  export let post: DbPost;
  export let liked: boolean;

  let user: DbUser;

  async function getUser() {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", post.user_id)
      .single();

    data && (user = data);
  }

  onMount(() => {
    getUser();
  });
</script>

<a href={`/posts/${post.id}`} class="search-result post-search-result">
  <div
    class={`${post.image_urls && post.image_urls.length === 0 ? "post-result-w-pfp" : "post-result-content flex-between"}`}
  >
    <div class="result-info gap-5 justify-center">
      {#if post.description}
        <p class="font-weight-normal">
          <LongHiddenText
            text={post.description}
            maxLength={60}
            showButton={false}
          />
        </p>
      {/if}
      <div class="post-actions m-block-0 align-center">
        <button
          class="post-action before-hover-anim rounded post-action-m-bottom"
        >
          <HeartIcon
            iconClass={`action-icon image-height-20 ${liked ? "liked-heart-icon" : "heart-icon"}`}
          />
        </button>
        <span
          class="even-less font-weight-normal post-action-m-left post-action-m-bottom"
        >
          {#if post.likes && post.likes.length >= 1}
            <span class="text-dot">·</span>
          {/if}
          {#if post.likes}
            {post.likes.length > 0
              ? post.likes.length === 1
                ? `${post.likes.length} like`
                : `${post.likes.length} likes`
              : ""}
          {/if}</span
        >
      </div>
    </div>
    {#if post.image_urls && post.image_urls.length === 0 && user}
      <div class="text-right gap-10">
        <div class="result-right flex-between">
          <div class="word-break">
            <a
              href={`/${user.url_username}`}
              class="result-displayed-username post-username"
            >
              {user.displayed_username}
            </a>
            <p class="result-url-username less font-weight-normal">
              {user.url_username}
            </p>
          </div>
        </div>
        <div class="align-center">
          <img
            src={user.image_url}
            alt="Result"
            class="result-user-image rounded image-height-40"
          />
        </div>
      </div>
    {:else if post.image_urls && post.image_urls.length > 0}
      <img
        src={post.image_urls[0]}
        alt="Result"
        class="post-search-result-image"
      />
    {/if}
  </div>
</a>
