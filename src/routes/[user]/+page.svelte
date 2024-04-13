<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import userDbData from "$lib/stores/user-db-data.js";
  import type { DBUserData, DBPost } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import TopPostNav from "$lib/components/TopPostNav.svelte";
  export let data;
  import CrossIcon from "$lib/components/icons/CrossIcon.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";
  let pageUser = data.user;
  let user: DBUserData;
  let pageError = "";
  let posts: DBPost[] | null;
  let currLoggedInUser: AuthUser;
  let maxChars = browser
    ? self.innerWidth > 970
      ? 76
      : self.innerWidth <= 970 && self.innerWidth >= 631
        ? 69
        : self.innerWidth <= 631
          ? 37
          : 0
    : 0;
  let currDbUser: DBUserData;
  let followed = false;
  let renderedDialog: "followers" | "following" | null = "followers";

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getFollowed(val.id);
  });

  if (browser) {
    window.onresize = (e: any) => {
      maxChars =
        self.innerWidth > 970
          ? 76
          : self.innerWidth <= 970 && self.innerWidth >= 631
            ? 69
            : self.innerWidth <= 631
              ? 37
              : 0;
    };
  }

  page.subscribe((val: any) => {
    posts = null;
    pageUser = val.data.user;
    renderedDialog = null;
    getUser();
  });

  async function follow() {
    if (currLoggedInUser) {
      followed = !followed;
      let followers = [];
      let currUserFollows = [];
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);
      const res = await supabase.from("users").select().eq("id", currDbUser.id);
      res.data &&
        res.data[0].follows &&
        (currUserFollows = res.data[0].follows);
      data && data[0].followers && (followers = data[0].followers);
      if (followers && !followers.includes(currDbUser.id)) {
        followers.push(currDbUser.id);
        currUserFollows.push(user.id);
        user.followers = followers;
        updateFollowers(followers, user.id);
        updateFollows(currUserFollows, currDbUser.id);
      } else {
        followers &&
          (followers = followers.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        currUserFollows &&
          (currUserFollows = currUserFollows.filter((user: string) => {
            return user !== pageUser;
          }));
        user.followers = followers;
        updateFollowers(followers, user.id);
        updateFollows(currUserFollows, currDbUser.id);
      }
    } else {
      console.log("You have to be logged in to follow users.");
    }
  }

  async function updateFollows(value: string[], uid: string) {
    const { error } = await supabase
      .from("users")
      .update({ follows: value })
      .eq("id", uid);
    console.log(error);
  }

  async function updateFollowers(value: string[], uid: string) {
    const { error } = await supabase
      .from("users")
      .update({ followers: value })
      .eq("id", uid);
    console.log(error);
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

  async function getPosts(id: string) {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("user_id", id);
    if (data && data.length > 0) {
      posts = data;
    }
  }

  async function getFollowed(uid: string) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("url_username", pageUser);
    if (data && data[0].followers && data[0].followers.includes(uid)) {
      followed = true;
      console.log("User is followed");
    } else {
      console.log("You don't follow this user");
    }
  }

  function editProfile() {
    console.log("Edit profile function");
  }

  function setFollowDialog(dialog: "following" | "followers" | null) {
    renderedDialog === dialog
      ? (renderedDialog = null)
      : (renderedDialog = dialog);
  }

  function followFromDialog(uid: string) {
    console.log("Follow function form the dialog");
  }
</script>

<svelte:head>
  <title>Futuregram - {data.user}</title>
</svelte:head>

{#if user && !pageError}
  {#if renderedDialog}
    <button
      on:click={() => {
        setFollowDialog(null);
      }}
      class="fullscreen-fixed-wrp"
    >
      <button
        on:click={(e) => {
          e.stopPropagation();
        }}
        class="sec-bg-element followers-dialog less-padding-dialog s1rem"
      >
        <div class="followers-dialog-top align-center flex-between">
          <p>
            <b>
              {renderedDialog.slice(0, 1).toUpperCase() +
                renderedDialog.slice(1, renderedDialog.length)}
            </b>
          </p>
          <button
            on:click={() => {
              setFollowDialog(null);
            }}
            class="grid-wrp no-style button-element"
          >
            <CrossIcon iconClass="top-nav-icon image-height-20" />
          </button>
        </div>
        <div class="followers-dialog-content">
          <!--  -->

          {#if renderedDialog === "followers"}
            {#each user.followers as followerID}
              <SearchResult uid={followerID} followDialog={true} />
            {/each}
          {:else}
            {#each user.follows as followerID}
              <SearchResult uid={followerID} followDialog={true} />
            {/each}
          {/if}

          <!--  -->
        </div>
      </button>
    </button>
  {/if}
  <div
    class="user-page-wrp desktop-nav-margin bottom-padding-nav mobile-nav-padding nav-top-space"
  >
    <TopPostNav {user} />
    <main class="user-page sec-bg-element">
      <div class="user-page-top">
        <div class="basic-user-info">
          <div class="user-text-info">
            <h1 class="displayed-username">{user.displayed_username}</h1>
            <p class="user-page-username less">@{user.url_username}</p>
            <div class="user-buttons-desktop">
              {#if currDbUser && currLoggedInUser}
                {#if currDbUser.id === user.id}
                  <button
                    class="button-element user-page-input primary-button"
                    on:click={editProfile}>Edit profile</button
                  >
                {:else}
                  {#if followed}
                    <button
                      class="button-element user-page-input red-bright-button"
                      on:click={follow}>Unfollow</button
                    >
                  {:else}
                    <button
                      class="button-element user-page-input primary-button"
                      on:click={follow}>Follow</button
                    >
                  {/if}
                  <a
                    href="/chat?id=blabla12342069"
                    class="button-element user-page-input secondary-button button-link"
                    >Message</a
                  >
                {/if}
              {:else}
                <a
                  href="/login"
                  class="button-element user-page-input primary-button"
                  on:click={follow}>Follow</a
                >
                <a
                  href="/login"
                  class="button-element user-page-input secondary-button button-link"
                  >Message</a
                >
              {/if}
            </div>
          </div>
          <img
            src={user.image_url}
            class="user-page-pfp rounded no-select"
            alt="Profile pic"
          />
        </div>
        <div class="user-follows-wrp inline-auto">
          {#if user.followers && user.followers.length > 0}
            <button
              on:click={() => {
                setFollowDialog("followers");
              }}
              class="user-follow-element no-style before-hover-anim button-element pointer"
            >
              <span class="user-follow-counter">
                {#if user.followers}
                  {user.followers.length <= 1
                    ? user.followers.length === 0
                      ? "0"
                      : user.followers.length
                    : user.followers.length}
                {:else}
                  0
                {/if}
              </span>
              <span class="follow-indicator even-less">
                {#if user.followers}
                  {#if user.followers.length < 1 || user.followers.length > 1}
                    Followers
                  {:else if user.followers.length === 1}
                    Follower
                  {/if}
                {:else}
                  Followers
                {/if}
              </span>
            </button>
          {:else}
            <div class="user-follow-element">
              <span class="user-follow-counter">
                {#if user.followers}
                  {user.followers.length <= 1
                    ? user.followers.length === 0
                      ? "0"
                      : user.followers.length
                    : user.followers.length}
                {:else}
                  0
                {/if}
              </span>
              <span class="follow-indicator even-less">
                {#if user.followers}
                  {#if user.followers.length < 1 || user.followers.length > 1}
                    Followers
                  {:else if user.followers.length === 1}
                    Follower
                  {/if}
                {:else}
                  Followers
                {/if}
              </span>
            </div>
          {/if}

          {#if user.follows && user.follows.length > 0}
            <button
              on:click={() => {
                setFollowDialog("following");
              }}
              class="user-follow-element no-style before-hover-anim button-element pointer"
            >
              <span class="user-follow-counter">
                {#if user.follows}
                  {user.follows.length <= 1
                    ? user.follows.length === 0
                      ? "0"
                      : user.follows.length
                    : user.follows.length}
                {:else}
                  0
                {/if}
              </span>
              <span class="follow-indicator even-less">Following</span>
            </button>
          {:else}
            <div class="user-follow-element">
              <span class="user-follow-counter">
                {#if user.follows}
                  {user.follows.length <= 1
                    ? user.follows.length === 0
                      ? "0"
                      : user.follows.length
                    : user.follows.length}
                {:else}
                  0
                {/if}
              </span>
              <span class="follow-indicator even-less">Following</span>
            </div>
          {/if}
          <div class="user-follow-element">
            <span class="user-follow-counter">
              {#if posts}
                {posts.length <= 1
                  ? posts.length === 0
                    ? "0"
                    : posts.length
                  : posts.length}
              {:else}
                0
              {/if}
            </span>
            <span class="follow-indicator even-less">
              {#if posts}
                {posts.length <= 1
                  ? posts.length === 0
                    ? "Posts"
                    : "Post"
                  : "Posts"}
              {:else}
                Posts
              {/if}
            </span>
          </div>
        </div>
        <p class="user-bio mobile">
          <LongHiddenText text={user.bio} maxLength={maxChars} />
        </p>
        <p class="user-bio desktop">{user.bio}</p>
        <div class="user-buttons-mobile">
          {#if currDbUser && currLoggedInUser}
            {#if currDbUser.id === user.id}
              <button
                class="button-element user-page-input primary-button"
                on:click={editProfile}>Edit profile</button
              >
            {:else}
              {#if followed}
                <button
                  class="button-element user-page-input red-bright-button"
                  on:click={follow}>Unfollow</button
                >
              {:else}
                <button
                  class="button-element user-page-input primary-button"
                  on:click={follow}>Follow</button
                >
              {/if}
              <a
                href="/chat?id=blabla12342069"
                class="button-element user-page-input secondary-button button-link"
                >Message</a
              >
            {/if}
          {:else}
            <a
              href="/login"
              class="button-element user-page-input primary-button"
              on:click={follow}>Follow</a
            >
            <a
              href="/login"
              class="button-element user-page-input secondary-button button-link"
              >Message</a
            >
          {/if}
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
              <b>
                {#if currDbUser}
                  {currDbUser.id === user.id ? "You" : data.user}
                {/if}
              </b> didn't post yet.
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
