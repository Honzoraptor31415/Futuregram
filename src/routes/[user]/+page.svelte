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
    console.log(data, error);
    if (data?.length === 0) {
      pageError = `User ${pageUser} doesn't exist`;
    } else {
      user = data ? data[0] : "";
      console.log(user);
    }
  }

  getUser();
</script>

{#if user && !pageError}
  <div class="user-page-wrp">
    <main class="user-page sec-bg-element">
      <div class="user-page-top">
        <div class="basic-user-info">
          <img
            src={user.image_url}
            class="user-page-pfp no-select"
            alt="Profile pic"
          />
          <div class="user-text-info">
            <h1 class="displayed-username">{user.displayed_username}</h1>
            <p class="user-page-username less">@{user.url_username}</p>
            <div class="user-buttons">
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
        </div>
        <p class="user-bio">
          {user.bio}
        </p>
      </div>
      <div class="user-posts-wrp">
        <h2>Photos:</h2>
        <div class="user-posts">
          <div class="user-posts-content">
            <a
              href="/posts/blablarandompostid123"
              class="post-prew"
              style="background-image: url(example-image.jpg);"
              ><div class="post-prew-overlay">
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a
              href="/posts/blablarandompostid123"
              class="post-prew"
              style="background-image: url(example-image.jpg);"
              ><div class="post-prew-overlay">
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a
              href="/posts/blablarandompostid123"
              class="post-prew"
              style="background-image: url(example-image.jpg);"
              ><div class="post-prew-overlay">
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>

            <a
              href="/posts/blablarandompostid123"
              class="post-prew"
              style="background-image: url(example-image.jpg);"
              ><div class="post-prew-overlay">
                <p class="post-prew-text">View 👉</p>
              </div>
            </a>
            <a
              href="/posts/blablarandompostid123"
              class="post-prew"
              style="background-image: url(example-image.jpg);"
              ><div class="post-prew-overlay">
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
    <h1>{pageError}</h1>
  </header>
{/if}
