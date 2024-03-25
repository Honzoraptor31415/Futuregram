<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";

  function search() {
    console.log("Search function");
  }
</script>

<svelte:head>
  <title>Search on Futuregram</title>
</svelte:head>

<main class="search-main">
  <div class="search-top">
    <div class="search-wrp">
      <label for="search" class="grid-wrp">
        <SearchIcon iconClass="text-field-icon" />
      </label>
      <input
        type="text"
        id="search"
        class="no-style search-input"
        placeholder="Search for users on Futuregram"
      />
    </div>
  </div>
  <div class="search-results">
    <div class="search-result"></div>
    <div class="search-result"></div>
    <div class="search-result"></div>
    <div class="search-result"></div>
  </div>
</main>
