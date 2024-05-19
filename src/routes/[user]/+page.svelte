<script lang="ts">
  import loggedInUser from "$lib/stores/user";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import userDbData from "$lib/stores/userDbData.js";
  import type { DBUserData, DBPost } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import TopPostNav from "$lib/components/TopPostNav.svelte";
  import CrossIcon from "$lib/components/icons/CrossIcon.svelte";
  import Follow from "$lib/components/Follow.svelte";
  import SearchResult from "$lib/components/SearchResult.svelte";
  import { supabase } from "$lib/supabaseClient";
  import PostPreview from "$lib/components/PostPreview.svelte";

  export let data;

  let pageUser = data.user;
  let user: DBUserData | null;
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
  let renderedDialog: "followers" | "following" | null = "followers";
  let followers: DBUserData[] = [];
  let follows: DBUserData[] = [];
  let loading = true;
  let functionLoading = false;

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
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
    user = null;
    followers = [];
    follows = [];
    getUser();
  });

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
      getFollowers();
      getFollows();
    }
  }

  async function getPosts(id: string) {
    if (functionLoading) return;

    functionLoading = true;

    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("user_id", id);

    if (data) {
      if (data.length > 0) {
        data
          .sort((a, b) => {
            return a.created_at - b.created_at;
          })
          .reverse();
        posts = data;
      }
      loading = false;
    }

    functionLoading = false;
  }

  function editProfile() {
    console.log("Edit profile function");
  }

  function setFollowDialog(dialog: "following" | "followers" | null) {
    renderedDialog === dialog
      ? (renderedDialog = null)
      : (renderedDialog = dialog);
  }

  async function getFollowers() {
    if (user && user.followers) {
      user.followers.forEach(async (followerID: string) => {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("id", followerID);
        if (data) {
          followers = [...followers, data[0]];
        }
      });
    }
  }

  async function getFollows() {
    if (user && user.follows) {
      user.follows.forEach(async (followID: string) => {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("id", followID);
        if (data) {
          follows = [...follows, data[0]];
        }
      });
    }
  }
</script>

<svelte:head>
  <title>Futuregram - {data.user}</title>
</svelte:head>

{#if user && !pageError}
  {#if renderedDialog}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        setFollowDialog(null);
      }}
      class="fullscreen-fixed-wrp"
    >
      <div
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
            {#each followers as follower}
              <SearchResult user={follower} followDialog={true} />
            {/each}
          {:else}
            {#each follows as follow}
              <SearchResult user={follow} followDialog={true} />
            {/each}
          {/if}

          <!--  -->
        </div>
      </div>
    </div>
  {/if}
  <div
    class="user-page-wrp desktop-nav-margin bottom-padding-nav mobile-nav-padding nav-top-space"
  >
    <TopPostNav showMenu={currDbUser === null || currDbUser?.id === user.id} />
    <main class="user-page">
      <div class="user-page-top">
        <div class="basic-user-info">
          <div class="user-text-info">
            <h1 class="displayed-username">{user.displayed_username}</h1>
            <p class="user-page-username less">@{user.url_username}</p>
            <div class="user-buttons-desktop">
              <Follow
                uid={user.id}
                btnClass="button-element user-page-input primary-button"
                unfollowClass="button-element user-page-input red-bright-button"
              />
              {#if currDbUser && currLoggedInUser}
                {#if currDbUser.id === user.id}
                  <button
                    class="button-element user-page-input primary-button"
                    on:click={editProfile}>Edit profile</button
                  >
                {:else}
                  <a
                    href="/chat?id=blabla12342069"
                    class="button-element user-page-input secondary-button button-link"
                    >Message</a
                  >
                {/if}
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
          <Follow
            uid={user.id}
            btnClass="button-element user-page-input primary-button"
            unfollowClass="button-element user-page-input red-bright-button"
          />
          {#if currDbUser && currLoggedInUser}
            {#if currDbUser.id === user.id}
              <button
                class="button-element user-page-input primary-button"
                on:click={editProfile}>Edit profile</button
              >
            {:else}
              <a
                href="/chat?id=blabla12342069"
                class="button-element user-page-input secondary-button button-link"
                >Message</a
              >
            {/if}
          {/if}
        </div>
      </div>
      <div class="user-posts-wrp">
        <h2 class="posts-heading">Posts:</h2>
        <div class="user-posts">
          {#if loading}
            <p>Loading...</p>
          {:else if !loading && posts}
            {#if posts.length > 0}
              <div class="post-prevs-grid">
                {#each posts as post}
                  <!-- I have to use conditional rendering instead of .neq(), because for some reason it returns a 400. Also on the supabase dashboard you can currentely (1716127109416) see the lil "We're facing a tech issue rn" dialog, so I think that might be the cause. -->
                  {#if post.image_urls.length > 0}
                    <PostPreview
                      imageUrl={post.image_urls[0]}
                      linkHref={`/posts/${post.id}`}
                    />
                  {/if}
                {/each}
              </div>
            {/if}
          {:else}
            <p class="no-posts less">
              <b>
                {currDbUser?.id === user.id ? "You" : data.user}
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
