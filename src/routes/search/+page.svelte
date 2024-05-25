<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import PostSearchResult from "$lib/components/PostSearchResult.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";
  import type { DbPost, DbUser } from "$lib/types/db";
  import Fuse from "fuse.js";
  import NoSearchResultDialog from "$lib/components/NoSearchResult.svelte";
  import userDbData from "$lib/stores/userDbData.js";

  export let data;

  let userResults: DbUser[] = [];
  let postResults: DbPost[] = [];
  let searchValue = "";
  let initialResults = data.users as DbUser[];
  let activeTab = "users";
  let currDbUser: DbUser;

  userDbData.subscribe((val: any) => {
    currDbUser = val;
  });

  function search() {
    if (activeTab === "users") {
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

  function switchTabs(currTab: string) {
    activeTab = currTab;
    search();
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
        autocomplete="off"
      />
    </div>
  </div>
  <div class="align-center gap-10 tab-desc-wrp">
    <p class="even-less">Search for:</p>
    <div class="tab-swichter-wrp align-center">
      <button
        class={`no-style tab-switch-button align-center pointer ${activeTab === "users" ? "tab-sb-active" : ""}`}
        on:click={() => {
          switchTabs("users");
        }}>Users</button
      >
      <button
        class={`no-style tab-switch-button align-center pointer ${activeTab === "posts" ? "tab-sb-active" : ""}`}
        on:click={() => {
          switchTabs("posts");
        }}>Posts</button
      >
    </div>
  </div>
  <div class="search-results">
    {#if searchValue}
      {#if activeTab === "users"}
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
              ? result.likes && result.likes.includes(currDbUser.id)
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
