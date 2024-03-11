<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  export let data;

  let pageUser = data.user;
  let user: any;
  let pageError = "";
  let posts: any;

  function follow() {
    console.log("Follow function");
  }

  async function getUser() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("url_username", pageUser);
    if (data?.length === 0) {
      pageError = `User ${pageUser} doesn't exist`;
    } else if (data) {
      user = data ? data[0] : "";
      getPosts(data[0].id);
    }
  }
  getUser();

  async function getAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    console.log(data, error);
  }

  async function getPosts(id: string) {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("user_id", id);
    if (data && data.length > 0) {
      posts = data;
    }
  }
</script>

<svelte:head>
  <title>Futuregram - {data.user}</title>
</svelte:head>

{#if user && !pageError}
  <div class="user-page-wrp">
    <main class="user-page sec-bg-element">
      <div class="user-page-top">
        <div class="basic-user-info">
          <div class="user-text-info">
            <h1 class="displayed-username">{user.displayed_username}</h1>
            <p class="user-page-username less">@{user.url_username}</p>
            <div class="user-buttons-desktop">
              <button
                class="button-element user-page-input primary-button"
                on:click={follow}>Follow</button
              >
              <a
                href="/chat?id=blabla12342069"
                class="button-element user-page-input secondary-button button-link"
                >Message</a
              >
            </div>
          </div>
          <img
            src={user.image_url}
            class="user-page-pfp no-select"
            alt="Profile pic"
          />
        </div>
        <p class="user-bio">
          {user.bio}
        </p>
        <div class="user-buttons-mobile">
          <button
            class="button-element user-page-input primary-button"
            on:click={follow}>Follow</button
          >
          <a
            href="/chat?id=blabla12342069"
            class="button-element user-page-input secondary-button button-link"
            >Message</a
          >
        </div>
      </div>
      <div class="user-posts-wrp">
        <h2 class="posts-heading">Posts:</h2>
        <div class="user-posts">
          {#if posts}
            <div class="user-posts-content">
              {#each posts as post}
                <a href={`/posts/${post.id}`} class="post-prew">
                  <div class="post-prew-overlay-wrp">
                    <img src={post.image_url} alt="" class="prew-image" />
                    <p class="post-prew-text">View 👉</p>
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <p class="no-posts less">
              <b class="first-capital">{data.user}</b> didn't post yet.
            </p>
          {/if}
        </div>
      </div>
    </main>
  </div>
{:else if pageError}
  <header class="flex-center-all">
    <h1 class="user-doesnt-exist-bro">{pageError}</h1>
  </header>
{/if}
