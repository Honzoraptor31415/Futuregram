<script lang="ts">
  import { browser } from "$app/environment";
  import type { MenuElement } from "$lib/types/app";
  import type { DBUserData } from "$lib/types/db";
  import userDbData from "$lib/stores/userDbData";
  import { getRandomHash } from "$lib/helper/random";

  export let icon: any;
  export let elements: MenuElement[] = [];
  export let btnClass: string;
  export let wrpClass: string = "dots-menu";
  export let wrpClassHid: string = "";
  export let wrpClassVis: string = "dots-menu-visible";
  export let iconClass: string;
  export let btnDisabled: boolean = false;
  export let authOnly: boolean = false;

  let menuVisible = false;
  let currDbUser: DBUserData;
  let id = `hidden-menu-${getRandomHash(70)}`;

  browser &&
    document.addEventListener("click", (e: any) => {
      if (e.target.id === id) {
        menu();
      } else {
        menuVisible = false;
      }
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
    {id}
    disabled={btnDisabled}
    class={`hidden-menu-button ${menuVisible ? "hidden-menu-active" : ""} rounded ${btnClass}`}
  >
    <svelte:component this={icon} iconClass={`p-events-none ${iconClass}`}
    ></svelte:component>

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
