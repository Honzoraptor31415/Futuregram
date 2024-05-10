<script lang="ts">
  import type { DBPost } from "$lib/types/db";
  import LongHiddenText from "./LongHiddenText.svelte";
  import HeartIcon from "./icons/HeartIcon.svelte";

  export let post: DBPost;
  export let liked: boolean;
</script>

<a href={`/posts/${post.id}`} class="search-result post-search-result">
  <div class="post-result-content flex-between">
    <div class="result-info gap-5 justify-center">
      <p class="result-displayed-username post-username">
        {post.title}
      </p>
      <p class="even-less font-weight-normal">
        <LongHiddenText
          text={post.description}
          maxLength={60}
          showButton={false}
        />
      </p>
      <div class="post-actions m-block-0 align-center">
        <button class="post-action before-hover-anim rounded">
          <HeartIcon
            iconClass={`action-icon image-height-20 ${liked ? "liked-heart-icon" : "heart-icon"}`}
          />
        </button>
        <span class="even-less font-weight-normal">
          {#if post.likes.length >= 1}
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
    <img
      src={post.image_url}
      alt={post.title}
      class="post-search-result-image"
    />
  </div>
</a>
