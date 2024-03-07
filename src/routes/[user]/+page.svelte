<script>
  export let data;
  console.log(data.user);
</script>

<div class="user-page-wrp">
  <main class="user-page sec-bg-element">
    <div class="user-page-top">
      <div class="basic-user-info">
        <img
          src="https://avatars.githubusercontent.com/u/151644171?v=4"
          class="user-page-pfp no-select"
          alt="Profile pic"
        />
        <div class="user-text-info">
          <h1 class="displayed-username">Honzoraptor 3.1415</h1>
          <p class="user-page-username less">@{data.user}</p>
          <div class="user-buttons">
            <button class="button-element user-page-input primary-button"
              >Follow</button
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
        I'm a random guy from southern Czechia, who codes. I mainly focus on
        making webapps like Futuregram with technologies like React or SvelteKit
        and Supabase or Appwrite.
      </p>
    </div>
    <div class="user-posts-wrp">
      <h2>Photos:</h2>
      <div class="user-posts-center">
        <div class="user-posts">
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
