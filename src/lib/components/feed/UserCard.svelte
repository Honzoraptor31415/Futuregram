<script lang="ts">
  import type { DbUser } from "$lib/types/db";
  import LongHiddenText from "../ui/LongHiddenText.svelte";
  import Follow from "./Follow.svelte";

  export let imageUrl: string;
  export let href: string;
  export let username: string;
  export let displayedUsername: string;
  export let userBio: string;
  export let uid: string;
  export let followers: DbUser[] = [];
  export let show: boolean;

  let hiding = false;

  $: {
    if (!show) {
      hiding = true;
      setTimeout(() => {
        show = false;
        hiding = false;
      }, 200);
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:mouseenter={() => {
      show = true;
    }}
    on:click={(e) => e.preventDefault()}
    class="user-hover-info sec-bg-element absolute flex-column gap-20 padding-20 radius-main font-weight-normal cursor-auto {hiding
      ? 'opacity-0'
      : ''}"
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
