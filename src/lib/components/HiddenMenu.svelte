<script lang="ts">
  import { browser } from "$app/environment";
  import type { MenuElement } from "$lib/types/app";
  import type { DBUserData } from "$lib/types/db";
  import userDbData from "$lib/stores/user-db-data";
  export let icon: any;
  export let elements: MenuElement[];
  export let btnClass: string;
  export let wrpClass: string;
  export let wrpClassHid: string;
  export let wrpClassVis: string;
  export let iconClass: string;
  export let btnDisabled: boolean = false;
  export let authOnly: boolean = false;

  let menuVisible = false;
  let currDbUser: DBUserData;

  browser &&
    document.addEventListener("click", () => {
      menuVisible = false;
    });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

  function menu() {
    menuVisible = !menuVisible;
  }
</script>

{#if !authOnly || (authOnly && currDbUser)}
  <button
    on:click={(e) => {
      e.stopPropagation();
      menu();
    }}
    disabled={btnDisabled}
    class={`${menuVisible ? "hidden-menu-active" : ""} rounded ${btnClass}`}
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
{/if}
