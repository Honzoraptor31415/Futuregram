<script lang="ts">
  import loggedInUser from "$lib/stores/user";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/ui/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import userDbData from "$lib/stores/userDbData.js";
  import type { DbUser, DbPost } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import TopPostNav from "$lib/components/feed/TopPostNav.svelte";
  import CrossIcon from "$lib/components/icons/CrossIcon.svelte";
  import Follow from "$lib/components/feed/Follow.svelte";
  import SearchResult from "$lib/components/ui/SearchResult.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { checkMaybeCreateRoom } from "$lib/helper/chats.js";
  import Post from "$lib/components/feed/Post.svelte";
  import TabsSwitcher from "$lib/components/ui/TabsSwitcher.svelte";
  import Error from "$lib/components/ui/Error.svelte";

  export let data;

  let pageUserUsername = data.user;
  let user: DbUser | null;
  let pageStatus = {
    isError: false,
    message: "",
  };

  let posts: DbPost[] | null = [];
  let replies: DbPost[] | null = [];
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
  let currDbUser: DbUser;
  let renderedDialog: "followers" | "following" | null = "followers";
  let followers: DbUser[] = [];
  let following: DbUser[] = [];
  let loading = true;
  let functionLoading = false;
  let currTab = "posts";

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
    posts = [];
    pageUserUsername = val.data.user;
    renderedDialog = null;
    user = null;
    followers = [];
    following = [];
    getUser();
  });

  async function getUser() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("url_username", pageUserUsername);
    if (data?.length === 0) {
      pageStatus.message = `User ${pageUserUsername} doesn't exist`;
      pageStatus.isError = true;
    } else if (data) {
      user = data ? data[0] : "";
      getPosts(data[0].id);
      getFollowers();
      getFollowing();
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
        posts = data.filter(({ replying_to }) => replying_to === null);
        replies = data.filter(({ replying_to }) => replying_to !== null);
        console.log(posts, replies);
      }
      loading = false;
    }

    functionLoading = false;
  }

  function setFollowDialog(dialog: "following" | "followers" | null) {
    renderedDialog === dialog
      ? (renderedDialog = null)
      : (renderedDialog = dialog);
  }

  async function getFollowers() {
    if (user && user.followers) {
      user.followers.forEach(async (followerId: string) => {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("id", followerId);
        if (data) {
          followers = [...followers, data[0]];
        }
      });
    }
  }

  async function getFollowing() {
    if (user && user.following) {
      user.following.forEach(async (followId: string) => {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("id", followId);
        if (data) {
          following = [...following, data[0]];
        }
      });
    }
  }

  $: if (user && followers.length > 0) {
    user.followers = followers.map(({ id }) => id);
  }
</script>

<svelte:head>
  <title>Futuregram - {data.user}</title>
</svelte:head>

{#if (user && currDbUser && currDbUser.blocked?.includes(user.id)) || pageStatus.isError}
  <Error code={404} message="Not Found" />
{:else if user && !pageStatus.isError}
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
            {#each following as follow}
              <SearchResult user={follow} followDialog={true} />
            {/each}
          {/if}

          <!--  -->
        </div>
      </div>
    </div>
  {/if}
  <div
    class="user-page-wrp desktop-nav-padding bottom-padding-nav mobile-nav-padding nav-top-space"
  >
    <TopPostNav showMenu={currDbUser === null || currDbUser?.id === user.id} />
    <main class="posts-inline-spacing">
      <div class="user-page-top">
        <div class="basic-user-info">
          <div class="user-text-info">
            <h1 class="displayed-username">{user.displayed_username}</h1>
            <p class="user-page-username less">@{user.url_username}</p>
            <div class="user-buttons-desktop">
              <Follow
                bind:followersAsUsers={followers}
                uid={user.id}
                btnClass="button-element user-page-input primary-button"
                unfollowClass="button-element user-page-input red-bright-button"
              />
              {#if currDbUser && currLoggedInUser}
                {#if currDbUser.id === user.id}
                  <a
                    class="button-element user-page-input primary-button"
                    href="/settings#profile">Edit profile</a
                  >
                {:else}
                  <button
                    on:click={() => {
                      user && checkMaybeCreateRoom(user.id);
                    }}
                    class="button-element user-page-input secondary-button button-link"
                    >Message</button
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
        <div class="user-follows-wrp m-inline-auto">
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

          {#if user.following && user.following.length > 0}
            <button
              on:click={() => {
                setFollowDialog("following");
              }}
              class="user-follow-element no-style before-hover-anim button-element pointer"
            >
              <span class="user-follow-counter">
                {#if user.following}
                  {user.following.length <= 1
                    ? user.following.length === 0
                      ? "0"
                      : user.following.length
                    : user.following.length}
                {:else}
                  0
                {/if}
              </span>
              <span class="follow-indicator even-less">Following</span>
            </button>
          {:else}
            <div class="user-follow-element">
              <span class="user-follow-counter">
                {#if user.following}
                  {user.following.length <= 1
                    ? user.following.length === 0
                      ? "0"
                      : user.following.length
                    : user.following.length}
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
            bind:followersAsUsers={followers}
            btnClass="button-element user-page-input primary-button"
            unfollowClass="button-element user-page-input red-bright-button"
          />
          {#if currDbUser && currLoggedInUser}
            {#if currDbUser.id === user.id}
              <a
                class="button-element user-page-input primary-button"
                href="/settings#profile">Edit profile</a
              >
            {:else}
              <button
                on:click={() => {
                  checkMaybeCreateRoom(pageUserUsername);
                }}
                class="button-element user-page-input secondary-button button-link"
                >Message</button
              >
            {/if}
          {/if}
        </div>
      </div>
      <div class="user-posts-wrp w-full">
        <TabsSwitcher
          wrpClass="grid-col-half"
          bind:currTab
          tabs={[
            {
              id: "posts",
              text: "Posts",
            },
            {
              id: "replies",
              text: "Replies",
            },
          ]}
        />
        <div class="user-posts w-full">
          {#if loading}
            <p>Loading...</p>
          {:else if !loading && posts && replies}
            {#if currTab === "posts" && posts.length > 0}
              <div class="w-full">
                {#each posts as { id, description, created_at, user_id, likes, image_urls }}
                  <Post
                    {id}
                    {description}
                    {created_at}
                    {user_id}
                    {likes}
                    {image_urls}
                    isFeedPost
                  />
                {/each}
              </div>
            {:else if currTab === "posts" && posts.length === 0}
              <p class="no-posts less">
                <b>
                  {currDbUser?.id === user.id ? "You" : data.user}
                </b> didn't post yet.
              </p>
            {:else if currTab === "replies" && replies.length > 0}
              <div class="w-full">
                {#each replies as { id, description, created_at, user_id, likes, image_urls, replying_to }}
                  <Post
                    {id}
                    {description}
                    {created_at}
                    {user_id}
                    {likes}
                    {image_urls}
                    isFeedPost
                  />
                {/each}
              </div>
            {:else if currTab === "replies" && replies.length === 0}
              <p class="no-posts less">
                <b>
                  {currDbUser?.id === user.id ? "You" : data.user}
                </b> didn't reply to any posts yet.
              </p>
            {/if}
          {/if}
        </div>
      </div>
    </main>
  </div>
{/if}
