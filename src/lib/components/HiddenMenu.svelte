<script lang="ts">
  import { browser } from "$app/environment";
  import type { MenuElement } from "$lib/types/app";
  export let icon: any;
  export let elements: MenuElement[];
  export let btnClass: string;
  export let wrpClass: string;
  export let wrpClassHid: string;
  export let wrpClassVis: string;
  export let iconClass: string;
  export let btnDisabled: boolean = false;

  let menuVisible = false;

  browser &&
    document.addEventListener("click", () => {
      menuVisible = false;
    });

  function menu() {
    menuVisible = !menuVisible;
  }
</script>

<button
  on:click={(e) => {
    e.stopPropagation();
    menu();
  }}
  disabled={btnDisabled}
  class={`${menuVisible ? "no-hover-before" : ""} rounded ${btnClass}`}
>
  <svelte:component this={icon} {iconClass}></svelte:component>

  <div class={`${wrpClass} ${menuVisible ? wrpClassVis : wrpClassHid}`}>
    {#if !btnDisabled}
      {#each elements as element}
        {#if element.type === "link"}
          <a class={element.class} href={element.href}>{element.text}</a>
        {:else}
          <button
            disabled={btnDisabled}
            class={element.class}
            on:click={element.onClick}>{element.text}</button
          >
        {/if}
      {/each}
    {/if}
  </div>
</button>
