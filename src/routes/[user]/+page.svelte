<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  export let data;

  let pageUser = data.user;
  let user: any;
  let pageError = "";

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
    } else {
      user = data ? data[0] : "";
    }
  }
  getUser();

  async function getAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    console.log(data, error);
  }
  getAuthUser();
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
        <!-- photos? nah man, these could also be like memes and stuff, so ima keep them posts -->
        <h2>Posts:</h2>
        <div class="user-posts">
          <div class="user-posts-content">
            <a href="/posts/blablarandompostid123" class="post-prew">
              <div class="post-prew-overlay-wrp">
                <img src="example-image.jpg" alt="" class="prew-image" />
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a href="/posts/blablarandompostid123" class="post-prew">
              <div class="post-prew-overlay-wrp">
                <img src="example-image2.jpg" alt="" class="prew-image" />
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a href="/posts/blablarandompostid123" class="post-prew">
              <div class="post-prew-overlay-wrp">
                <img src="example-image3.jpg" alt="" class="prew-image" />
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>

            <a href="/posts/blablarandompostid123" class="post-prew">
              <div class="post-prew-overlay-wrp">
                <img src="example-image4.jpg" alt="" class="prew-image" />
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a href="/posts/blablarandompostid123" class="post-prew">
              <div class="post-prew-overlay-wrp">
                <img src="example-image2.jpg" alt="" class="prew-image" />
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
{:else if pageError}
  <header class="flex-center-all">
    <h1 class="user-doesnt-exist-bro">{pageError}</h1>
  </header>
{/if}
