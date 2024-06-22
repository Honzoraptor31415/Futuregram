<script lang="ts">
  import BackgroundWrp from "../ui/BackgroundWrp.svelte";

  export let imageUrl: string;
  export let wrpClass = "grid-wrp";
  export let imageClass = "";

  let isFullsreen = false;
</script>

{#if isFullsreen}
  <BackgroundWrp
    bgOpacity={0.6}
    hideFunc={() => {
      isFullsreen = false;
    }}
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      class="no-location-change fullscreened-feed-image"
      alt="Fullscreen"
      src={imageUrl}
    />
  </BackgroundWrp>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="no-location-change pointer {wrpClass}"
    on:click={(e) => {
      e.preventDefault();
      isFullsreen = true;
    }}
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      class="no-location-change {imageClass}"
      alt="Fullscreen"
      src={imageUrl}
    />
  </div>
{/if}
