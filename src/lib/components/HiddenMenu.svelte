<script lang="ts">
  import { browser } from "$app/environment";
  import type { menuElement } from "$lib/types/app";
  export let icon: any;
  export let elements: menuElement[];
  export let btnClass: string;
  export let wrpClass: string;
  export let wrpClassHid: string;
  export let wrpClassVis: string;
  export let iconClass: string;

  let menuVisible = false;

  console.log(typeof icon);

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
  class={btnClass}
>
  <svelte:component this={icon} {iconClass}></svelte:component>

  <div class={`${wrpClass} ${menuVisible ? wrpClassVis : wrpClassHid}`}>
    {#each elements as element}
      {#if element.type === "link"}
        <a class={element.class} href={element.href}>{element.text}</a>
      {:else}
        <button class={element.class} on:click={element.onClick}
          >{element.text}</button
        >
      {/if}
    {/each}
  </div>
</button>
