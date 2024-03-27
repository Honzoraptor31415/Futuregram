<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import userDbData from "$lib/stores/user-db-data.js";
  import type { dbUserData, dbPost } from "$lib/types/db";
  import type { authUser } from "$lib/types/auth";
  export let data;

  let pageUser = data.user;
  let user: dbUserData;
  let pageError = "";
  let posts: dbPost[] | null;
  let currLoggedInUser: authUser;
  let maxChars = browser
    ? self.innerWidth > 970
      ? 76
      : self.innerWidth <= 970 && self.innerWidth >= 631
        ? 69
        : self.innerWidth <= 631
          ? 37
          : 0
    : 0;
  let currDbUser: dbUserData;
  let followed = false;

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getFollowed(val.url_username);
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
        .eq("url_username", user.url_username);
      const res = await supabase.from("users").select().eq("id", currDbUser.id);
      res.data &&
        res.data[0].follows &&
        (currUserFollows = res.data[0].follows);
      data && data[0].followers && (followers = data[0].followers);
      if (followers && !followers.includes(currDbUser.url_username)) {
        followers.push(currDbUser.url_username);
        currUserFollows.push(user.url_username);
        user.followers = followers;
        updateFollowers(followers, user.url_username);
        updateFollows(currUserFollows, currDbUser.url_username);
      } else {
        followers &&
          (followers = followers.filter((user: any) => {
            return user !== currDbUser.url_username;
          }));
        currUserFollows &&
          (currUserFollows = currUserFollows.filter((user: any) => {
            return user !== pageUser;
          }));
        user.followers = followers;
        updateFollowers(followers, user.url_username);
        updateFollows(currUserFollows, currDbUser.url_username);
      }
    } else {
      console.log("You have to be logged in to follow users.");
    }
  }

  async function updateFollows(value: string[], username: string) {
    const { error } = await supabase
      .from("users")
      .update({ follows: value })
      .eq("url_username", username);
    console.log(error);
  }

  async function updateFollowers(value: string[], username: string) {
    const { error } = await supabase
      .from("users")
      .update({ followers: value })
      .eq("url_username", username);
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

  async function getFollowed(currUsername: string) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("url_username", pageUser);
    if (data && data[0].followers && data[0].followers.includes(currUsername)) {
      followed = true;
      console.log("User is followed");
    } else {
      console.log("You don't follow this user");
    }
  }

  function editProfile() {
    console.log("Edit profile function");
  }
</script>

<svelte:head>
  <title>Futuregram - {data.user}</title>
</svelte:head>

{#if user && !pageError}
  <div class="user-page-wrp bottom-padding-nav">
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
            class="user-page-pfp no-select"
            alt="Profile pic"
          />
        </div>
        <div class="user-follows-wrp mobile">
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
            <span class="follow-indicator even-less">Followers</span>
          </div>
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
