<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";
  import type { DBUserData } from "$lib/types/db";
  import Fuse from "fuse.js";

  export let data;

  let results: DBUserData[] = [];
  let searchValue: string;
  let initialResults = data.users as DBUserData[];

  const fuseOptions = {
    keys: ["url_username", "displayed_username", "bio"],
  };

  const fuse = new Fuse(data.users as any[], fuseOptions);

  function search() {
    const fuseResult = fuse.search(searchValue.trim());
    results = fuseResult.map((result) => {
      return result.item;
    });
  }
</script>

<svelte:head>
  <title>Search on Futuregram</title>
</svelte:head>

<main class="search-main bottom-padding-nav desktop-nav-margin">
  <div class="search-top">
    <div class="search-wrp dark-input">
      <label for="search" class="grid-wrp">
        <SearchIcon iconClass="text-field-icon" />
      </label>
      <input
        type="text"
        id="search"
        class="no-style search-input"
        placeholder="Search"
        bind:value={searchValue}
        on:input={search}
      />
    </div>
  </div>
  <div class="search-results">
    {#if results.length > 0}
      {#each results as result}
        <SearchResult user={result} />
      {/each}
    {:else if !searchValue}
      {#each initialResults as result}
        <SearchResult user={result} />
      {/each}
    {:else}
      <div
        class="flex-center-all alpha-bg-element no-search-results ab-app-dialog"
      >
        <p class="less">No results 🤷‍♂️</p>
      </div>
    {/if}
  </div>
</main>
