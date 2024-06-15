<script lang="ts">
  export let text: string;
  export let maxLength: number;
  export let showButton: boolean = true;

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
  {#if showButton}
    {#if textShowed}
      <button
        on:click={(e) => {
          e.preventDefault();
          showmore();
        }}
        class="desc-dots showed-desc-dots hover-before-height no-location-change"
        ><span class="less no-location-change">less</span></button
      >
    {:else}
      <button
        on:click={(e) => {
          e.preventDefault();
          showmore();
        }}
        class="desc-dots hover-before-height no-location-change"
        ><span class="less no-location-change">... more</span></button
      >
    {/if}
  {:else}
    <span class="less">...</span>
  {/if}
{/if}
