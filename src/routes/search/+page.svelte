<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import PostSearchResult from "$lib/components/ui/PostSearchResult.svelte";
  import SearchResult from "$lib/components/ui/SearchResult.svelte";
  import type { DbPost, DbUser } from "$lib/types/db";
  import Fuse from "fuse.js";
  import NoSearchResultDialog from "$lib/components/ui/NoSearchResult.svelte";
  import userDbData from "$lib/stores/userDbData.js";
  import TabsSwitcher from "$lib/components/ui/TabsSwitcher.svelte";

  export let data;

  let userResults: DbUser[] = [];
  let postResults: DbPost[] = [];
  let searchValue = "";
  let initialResults = data.users as DbUser[];
  let currTab = "users";
  let currDbUser: DbUser;

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

  function search() {
    if (currTab === "users") {
      const fuse = new Fuse(data.users as any[], {
        keys: ["url_username", "displayed_username", "bio"],
      });
      const postsResult = fuse.search(searchValue.trim());
      userResults = postsResult.map((result) => {
        return result.item;
      });
    } else {
      const fuse = new Fuse(data.posts as any[], {
        keys: ["description"],
      });
      const postsResult = fuse.search(searchValue.trim());
      console.log(postsResult);

      postResults = postsResult.map((result) => {
        return result.item;
      });
    }
  }
</script>

<svelte:head>
  <title>Search on Futuregram</title>
</svelte:head>

<main class="search-main bottom-padding-nav desktop-nav-padding">
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
        autocomplete="off"
      />
    </div>
  </div>
  <TabsSwitcher
    tabs={[
      {
        id: "users",
        text: "Users",
      },
      {
        id: "posts",
        text: "Posts",
      },
    ]}
    wrpClass="grid-col-half w-full m-top-14"
    bind:currTab
    sharedFunc={search}
  />
  <div class="m-top-14 w-full">
    {#if searchValue}
      {#if currTab === "users"}
        {#if userResults.length > 0}
          {#each userResults as result}
            <SearchResult user={result} />
          {/each}
        {:else}
          <NoSearchResultDialog />
        {/if}
      {:else if postResults.length > 0}
        {#each postResults as result}
          <PostSearchResult
            post={result}
            liked={currDbUser
              ? result.likes?.includes(currDbUser.id)
                ? true
                : false
              : false}
          />
        {/each}
      {:else}
        <NoSearchResultDialog />
      {/if}
    {:else}
      {#each initialResults as result}
        <SearchResult user={result} />
      {/each}
    {/if}
  </div>
</main>
