<script lang="ts">
  import { browser } from "$app/environment";
  import type { MenuElement } from "$lib/types/app";
  import type { DbUser } from "$lib/types/db";
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
  let currDbUser: DbUser;
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="relative hidden-menu-wrp">
    <button
      {id}
      disabled={btnDisabled}
      class={`hidden-menu-button no-location-change ${menuVisible ? "hidden-menu-active" : ""} rounded ${btnClass}`}
      on:click={(e) => e.preventDefault()}
    >
      <svelte:component this={icon} iconClass={`p-events-none ${iconClass}`}
      ></svelte:component>
    </button>
    <div class={`${wrpClass} ${menuVisible ? wrpClassVis : wrpClassHid}`}>
      {#if !btnDisabled}
        {#each elements as element}
          {#if element.type === "link"}
            <a class={element.class} href={element.href}>{element.text}</a>
          {:else}
            <button
              disabled={btnDisabled}
              class="no-location-change {element.class}"
              on:click={(e) => {
                e.preventDefault();
                element.onClick();
              }}>{element.text}</button
            >
          {/if}
        {/each}
      {/if}
    </div>
  </div>
{/if}
