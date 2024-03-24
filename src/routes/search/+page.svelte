<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";

  function search() {
    console.log("Search function");
  }
</script>

<main class="search-main">
  <div class="search-top">
    <div class="search-wrp">
      <SearchIcon iconClass="small-post-icon text-field-icon" />
      <input
        type="text"
        class="no-style"
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
