<script lang="ts">
  import RedFormStar from "./RedFormStar.svelte";
  import * as validation from "$lib/helper/form-validation";

  export let id: string;
  export let placeholder = "";
  export let wrpClass = "";
  export let type = "text";
  export let required = false;
  export let starClass = "";
  export let initLabel: string;
  let label = "";

  export let value = "";
</script>

<div class={`form-element ${wrpClass}`}>
  <label for={id} class={label !== "" ? "form-error" : ""}>
    {#if label === ""}
      {initLabel}
      {#if required}
        <RedFormStar {starClass} />
      {/if}
    {:else}
      {label}
    {/if}
  </label>
  {#if type === "text"}
    <input
      type="text"
      {id}
      bind:value
      class={`user-input user-input-text ${label !== "" ? "form-error-input" : ""}`}
      {placeholder}
    />
  {:else if type === "password"}
    <input
      type="password"
      {id}
      bind:value
      class={`user-input user-input-text ${label !== "" ? "form-error-input" : ""}`}
      {placeholder}
    />
  {:else}
    <textarea
      bind:value
      {id}
      {placeholder}
      class={`user-input user-input-text ${label !== "" ? "form-error-input" : ""}`}
    ></textarea>
  {/if}
</div>
