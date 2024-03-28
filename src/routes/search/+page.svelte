<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";

  const results = [
    "fhkasflhhsdkflh",
    "jhgkjhg51597žjhd-sdfůah",
    "lajsf-768igjlgasdf-uotdasU",
    "LJASGDF6-fhgFHJASD",
    "fhkasflhhsdkjhagfflh",
    "jhgkjhg51234567597žjhd-sdfůah",
    "l-768igjlgasdf-uotdasU",
    "ljasfljglj78pen1s-fhgFHJASD",
  ];

  function search() {
    console.log("Search function");
  }
</script>

<svelte:head>
  <title>Search on Futuregram</title>
</svelte:head>

<main class="search-main bottom-padding-nav">
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
      <SearchResult id={result} />
    {/each}
  </div>
</main>
