<script lang="ts">
  import type { DBUserData } from "$lib/types/db";
  export let user: DBUserData;
  export let followDialog: boolean = false;
  import Follow from "$lib/components/Follow.svelte";
</script>

{#if user}
  <a
    href={`/${user.url_username}`}
    class={`search-result ${followDialog ? "follow-dialog-result" : ""}`}
  >
    <div class="result-left">
      <img
        src={user.image_url}
        alt="Result"
        class={`result-user-image rounded image-height-40`}
      />
    </div>
    <div class="result-right flex-between">
      <div class={`result-info ${followDialog ? "follow-dialog-info" : ""}`}>
        <p class="result-displayed-username post-username">
          {user.displayed_username}
        </p>
        <p class="result-url-username less font-weight-normal">
          {user.url_username}
        </p>
      </div>
      <div class="result-right-button">
        <Follow
          btnClass="button-element secondary-button user-page-input search-follow"
          uid={user.id}
        />
      </div>
    </div>
  </a>
{/if}
