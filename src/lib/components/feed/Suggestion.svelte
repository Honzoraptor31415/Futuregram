<script lang="ts">
  import Follow from "./Follow.svelte";
  import LongHiddenText from "../ui/LongHiddenText.svelte";

  export let imageUrl: string;
  export let displayedUsername: string;
  export let username: string;
  export let uid: string;
</script>

<a
  href={`/${username}`}
  class="alpha-bg-element padding-14 flex-column align-center suggestion snap-swiper-item flex-between"
>
  <img
    src={imageUrl}
    alt={displayedUsername}
    class="rounded suggestion-image w-fit"
  />
  <div class="flex-column align-center">
    <p class="post-username result-displayed-username">
      <LongHiddenText
        text={displayedUsername}
        maxLength={12}
        showButton={false}
      />
    </p>
    <p class="font-weight-normal even-less">
      <LongHiddenText text={username} maxLength={10} showButton={false} />
    </p>
  </div>
  <Follow
    btnClass="button-element secondary-button user-page-input search-follow w-full padding-block-6"
    {uid}
  />
</a>
