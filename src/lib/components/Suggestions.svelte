<script lang="ts">
  import userDbData from "$lib/stores/user-db-data";
  import { supabase } from "$lib/supabaseClient";
  import type { DBUserData } from "$lib/types/db";
  import { onMount } from "svelte";
  import Suggestion from "./Suggestion.svelte";

  let suggestions: DBUserData[] = [];
  let currDbUser: DBUserData;

  userDbData.subscribe((val: any) => {
    if (val) {
      currDbUser = val;
      getSuggestions();
    }
  });

  async function getSuggestions() {
    if (currDbUser) {
      const { data } = await supabase
        .from("users")
        .select()
        .neq("id", currDbUser.id);
      if (data) {
        suggestions = data;
      }
    }
  }
</script>

<div class="feed-page-post-wrp">
  <p class="mobile-padding-left-feed"><b>Who you may know</b></p>
  <div class="suggestions-content gap-5 mobile-padding-left-feed">
    {#if suggestions.length > 0}
      {#each suggestions as user}
        <Suggestion
          uid={user.id}
          imageUrl={user.image_url}
          displayedUsername={user.displayed_username}
          username={user.url_username}
        />
      {/each}
    {/if}
  </div>
</div>
