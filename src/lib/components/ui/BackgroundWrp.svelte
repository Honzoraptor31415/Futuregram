<script lang="ts">
  export let hideFunc: () => void;
  export let bgOpacity: number;

  const overlayId = "bg-overlay";

  function handleHideWarning(e: any) {
    e.target.id === overlayId && hideFunc();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fullscreen-fixed-wrp no-location-change"
  style="--fullscreen-wrp-bg-opacity: {bgOpacity}"
  id={overlayId}
  on:click={handleHideWarning}
>
  <slot />
</div>
