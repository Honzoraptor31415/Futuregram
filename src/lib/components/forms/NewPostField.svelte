<script lang="ts">
  import { getRandomHash } from "$lib/helper/random";
  import ImageIcon from "../icons/ImageIcon.svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";

  export let value: string;
  export let placeholder = "What's going on?";
  export let wrpClass = "";
  export let onChange: (e: any) => void;
  export let files: any;
  export let submit: () => void;
  export let postBeingInserted: boolean;

  const areaId = `post-input-${getRandomHash(10)}`;
  const inputId = `image-input-${getRandomHash(10)}`;
</script>

<div class={`new-post-input-wrp rounded-main flex-column ${wrpClass}`}>
  <textarea
    id={areaId}
    class={`no-style no-resize comment-edit-input new-post-input`}
    {placeholder}
    bind:value
  ></textarea>
  <div class="new-post-ctrls flex-between align-end">
    <label
      class="post-action before-hover-anim rounded gap-3 align-center post-action-m-bottom"
      for={inputId}
    >
      <input
        on:change={onChange}
        type="file"
        id={inputId}
        class="hidden"
        accept="image/jpeg,image/png,image/webp"
        on:change={onChange}
        bind:files
        multiple
      />
      <ImageIcon iconClass="action-icon image-height-20 np-image-icon" />
    </label>
    <button
      disabled={(!files && !value) || postBeingInserted}
      on:click={submit}
      class="primary-button button-element user-page-input align-center gap-5"
    >
      {#if postBeingInserted}
        Creating
        <Spinner size={20} borderWidth={3} color="var(--sec-bg)" />
      {:else}
        Create!
      {/if}
    </button>
  </div>
</div>
