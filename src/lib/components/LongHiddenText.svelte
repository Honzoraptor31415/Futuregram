<script lang="ts">
  export let text: string;
  export let maxLength: number;

  let textShowed = false;

  function showmore() {
    textShowed = !textShowed;
  }
</script>

{#if text.length < maxLength}
  {text}
{:else}
  {#if textShowed}
    {text}
  {:else}
    {text.slice(0, maxLength - 5)}
  {/if}
  {#if textShowed}
    <button
      on:click={showmore}
      class="desc-dots showed-desc-dots hover-before-height"
      ><span class="less">less</span></button
    >
  {:else}
    <button on:click={showmore} class="desc-dots hover-before-height"
      ><span class="less">... more</span></button
    >
  {/if}
{/if}
