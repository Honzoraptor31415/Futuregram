<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";

  const results = [
    "3f755bce-f7a3-4251-907c-3ac9d4a5adc7",
    "3bf69b16-0140-4679-970d-03b6f8710e7f",
    "696eb608-b094-465f-903b-9bb38d11fdfe",
    "71bc76bd-719e-4e93-bbc2-e1bbb4417603",
  ];

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
    {#each results as result}
      <SearchResult uid={result} />
    {/each}
  </div>
</main>
