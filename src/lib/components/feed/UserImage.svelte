<script lang="ts">
  import Follow from "../feed/Follow.svelte";
  import LongHiddenText from "../ui/LongHiddenText.svelte";
  import type { DbUser } from "$lib/types/db";

  export let imageUrl: string;
  export let imageClass = "image-height-40";
  export let href: string;
  export let username: string;
  export let displayedUsername: string;
  export let userBio: string;
  export let uid: string;
  export let followers: DbUser[] = [];
  export let wrpClass = "user-image-wrp";

  let show = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:mouseenter={() => {
    show = true;
  }}
  on:mouseleave={() => {
    show = false;
  }}
  class={wrpClass}
>
  <a {href} class="grid-wrp">
    <img
      src={imageUrl}
      alt={username}
      class={`post-user-image rounded margin-top-4 ${imageClass}`}
    />
  </a>
  {#if show}
    <div
      class="user-hover-info sec-bg-element absolute flex-column gap-20 padding-20 radius-main"
    >
      <a {href} class="flex-between">
        <div>
          <h2 class="hover-underline">{displayedUsername}</h2>
          <p class="font-weight-normal">{username}</p>
        </div>
        <img src={imageUrl} alt={username} class="image-height-70 rounded" />
      </a>
      <div class="gap-5 flex-column">
        <p>
          <LongHiddenText text={userBio} maxLength={170} showButton={false} />
        </p>
        {#if followers.length > 0}
          <p class="less">
            {followers.length}
            {followers.length === 1 ? "follower" : "followers"}
          </p>
        {/if}
      </div>
      <Follow
        {uid}
        strictClasses
        btnClass="button-element user-page-input primary-button text-center"
        unfollowClass="button-element user-page-input secondary-button white"
        bind:followersAsUsers={followers}
        showEditingButtonWhenCurrUser
      />
    </div>
  {/if}
</div>
