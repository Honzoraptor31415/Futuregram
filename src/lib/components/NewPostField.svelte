<script lang="ts">
  import ImageIcon from "./icons/ImageIcon.svelte";
  export let value: string;
  export let placeholder = "What's going on?";
  export let wrpClass = "";
  export let onChange: (e: any) => void;
</script>

<div class={`new-post-input-wrp rounded-main flex-column ${wrpClass}`}>
  <textarea
    id="post-input"
    class={`no-style no-resize comment-edit-input new-post-input`}
    {placeholder}
    bind:value
  ></textarea>
  <div class="new-post-ctrls">
    <label
      class="post-action before-hover-anim rounded gap-3 align-center bha-keep-scale"
      for="image-input"
    >
      <input
        on:change={onChange}
        type="file"
        id="image-input"
        class="hidden"
        multiple
        accept="image/jpeg,image/png,image/webp"
      />
      <ImageIcon iconClass="action-icon image-height-20 np-image-icon" />
    </label>
  </div>
</div>
