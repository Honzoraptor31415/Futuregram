<script lang="ts">
  import { getRandomHash } from "$lib/helper/random";
  import ImageIcon from "./icons/ImageIcon.svelte";

  export let value: string;
  export let placeholder = "What's going on?";
  export let wrpClass = "";
  export let onChange: (e: any) => void;
  export let files: any;
  export let photoFile: any;
  export let submit: () => void;

  const areaId = `post-input-${getRandomHash(10)}`;
  const inputId = `image-input-${getRandomHash(10)}`;

  $: console.log(files, photoFile);
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
        bind:this={photoFile}
        bind:files
        multiple
      />
      <ImageIcon iconClass="action-icon image-height-20 np-image-icon" />
    </label>
    <button
      disabled={!files && !value}
      on:click={submit}
      class="primary-button button-element user-page-input">Create!</button
    >
  </div>
</div>
