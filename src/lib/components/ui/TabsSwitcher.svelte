<script lang="ts">
  export let currTab: string;
  export let tabs: {
    text: string;
    id: string;
  }[];
  export let wrpClass = "flex-row";
  export let sharedFunc = () => {};
</script>

<div class="tabs-wrp {wrpClass}">
  {#each tabs as { id, text }}
    <button
      class="no-style page-tab-button pointer padding-14 btn-active-opacity-to relative {currTab ===
      id
        ? 'page-tab-button-current'
        : ''}"
      on:click={() => {
        currTab = id;
        sharedFunc();
      }}
    >
      <span class="less">{text}</span>
    </button>
  {/each}
</div>
