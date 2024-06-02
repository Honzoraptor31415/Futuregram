<script lang="ts">
  export let hideFunc: () => void;

  const overlayId = "bg-overlay";

  function handleHideWarning(e: any) {
    e.target.id === overlayId && hideFunc();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fullscreen-fixed-wrp" id={overlayId} on:click={handleHideWarning}>
  <slot />
</div>
