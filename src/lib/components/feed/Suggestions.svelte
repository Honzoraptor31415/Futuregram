<script lang="ts">
  import userDbData from "$lib/stores/userDbData";
  import { supabase } from "$lib/supabaseClient";
  import type { DbUser } from "$lib/types/db";
  import { onMount } from "svelte";
  import Suggestion from "./Suggestion.svelte";

  let suggestions: DbUser[] = [];
  let currDbUser: DbUser;

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
  <div
    class="suggestions-content snap-swiper-x gap-10 mobile-padding-left-feed"
  >
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
