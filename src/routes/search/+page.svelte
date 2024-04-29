<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";
  import type { DBUserData } from "$lib/types/db";

  let results: DBUserData[];

  async function getResults() {
    const { data } = await supabase.from("users").select();
    data && (results = data)
  }
  getResults();

  function search() {
    console.log("Search function");
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
      />
    </div>
  </div>
  <div class="search-results">
    {#if results}
      {#each results as result}
        <SearchResult user={result} />
      {/each}
    {/if}
  </div>
</main>
