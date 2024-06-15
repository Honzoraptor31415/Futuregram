<script lang="ts">
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/ui/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import type { DbPost, DbUser } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import CommentIcon from "../icons/CommentIcon.svelte";
  import type { MenuElement } from "$lib/types/app";
  import { supabase } from "$lib/supabaseClient";
  import HiddenMenu from "$lib/components/ui/HiddenMenu.svelte";
  import ThreeDotsHoriz from "../icons/ThreeDotsHoriz.svelte";
  import { blockUser, report } from "$lib/helper/feedAdvanced";
  import SaveIcon from "../icons/SaveIcon.svelte";
  import { setNotification } from "$lib/helper/appNotifications";
  import { actionWarning } from "$lib/stores/app";
  import NewPostForm from "../forms/NewPostForm.svelte";
  import UserCard from "./UserCard.svelte";
  import { goto } from "$app/navigation";

  dayjs.extend(relativeTime);
  dayjs().format();

  export let id: string;
  export let created_at: number;
  export let image_urls: string[] | null;
  export let description: string | null;
  export let likes: string[] | null;
  export let user_id: string;
  export let isFeedPost: boolean = false;
  export let saved: boolean = false;
  export let isChild = false;
  export let editing = false;

  let currUser: AuthUser;
  let postComments: DbPost[] = [];
  let postCreator: DbUser;
  let liked = false;
  let currDbUser: DbUser;
  let maxChars = browser
    ? self.innerWidth > 970
      ? 69
      : self.innerWidth <= 970 && self.innerWidth >= 631
        ? 55
        : self.innerWidth <= 631
          ? 41
          : 0
    : 0;
  let firstId: string;
  let postShown = true;
  let menuElements: MenuElement[];
  let showUserCard = false;

  const defaultPostOpts = isFeedPost
    ? [
        {
          type: "button",
          onClick: togglePostVisibility,
          class: "menu-link",
          text: "Hide",
        },
        {
          type: "button",
          onClick: () => {
            blockUser("random-id-45478-utfasdýasdýř87ř");
          },
          class: "menu-link red",
          text: "Block account",
        },
        {
          type: "button",
          onClick: () => {
            report("post", id);
          },
          class: "menu-link red",
          text: "Report post",
        },
      ]
    : [
        {
          type: "button",
          onClick: () => {
            blockUser("random-id-45478-utfasdýasdýř87ř");
          },
          class: "menu-link red",
          text: "Block account",
        },
        {
          type: "button",
          onClick: () => {
            report("post", id);
          },
          class: "menu-link red",
          text: "Report post",
        },
      ];

  const authorPostOpts: MenuElement[] = isFeedPost
    ? [
        {
          type: "button",
          onClick: togglePostVisibility,
          class: "menu-link",
          text: "Hide",
        },
        {
          type: "link",
          class: "menu-link",
          text: "Edit",
          href: `/posts/${id}?edit`,
        },
        {
          type: "button",
          onClick: remove,
          class: "menu-link red",
          text: "Delete post",
        },
      ]
    : [
        {
          type: "link",
          class: "menu-link",
          text: "Edit",
          href: `/posts/${id}?edit`,
        },
        {
          type: "button",
          onClick: remove,
          class: "menu-link red",
          text: "Delete post",
        },
      ];

  if (browser) {
    window.onresize = (e: object | Event) => {
      maxChars =
        self.innerWidth > 970
          ? 69
          : self.innerWidth <= 970 && self.innerWidth >= 631
            ? 55
            : self.innerWidth <= 631
              ? 41
              : 0;
    };
  }

  page.subscribe((val: any) => {
    getComments();
    postComments = [];
  });

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
  });

  async function getComments() {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("replying_to", id);

    if (data && data.length > 0) {
      postComments = data
        .sort((a: any, b: any) => {
          return a.likes?.length - b.likes?.length;
        })
        .reverse();
      firstId = postComments[0].id;
    }
  }
  getComments();

  async function getPostCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data && data.length > 0) {
      postCreator = data[0];
    }
  }
  getPostCreator(user_id);

  userDbData.subscribe((val: any) => {
    if (val) {
      currDbUser = val;
      getLikes(val.id);
      getIsSaved();
      likesListener();
      getMenuElements();
    }
  });

  async function getLikes(uid: string) {
    const { data, error } = await supabase.from("posts").select().eq("id", id);
    if (data && data[0].likes && data[0].likes.includes(uid)) {
      liked = true;
    }
  }

  async function like() {
    if (currUser) {
      liked = !liked;
      let localLikes = [];
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id);
      data && data[0].likes && (localLikes = data[0].likes);
      if (localLikes && !localLikes.includes(currDbUser.id)) {
        localLikes.push(currDbUser.id);
        likes = localLikes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: localLikes })
          .eq("id", id);
      } else {
        localLikes &&
          (localLikes = localLikes.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        likes = localLikes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: localLikes })
          .eq("id", id);
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  function likesListener() {
    const handleInserts = (payload: any) => {
      if (likes) {
        likes = likes.filter((user: string) => {
          return user !== currDbUser.id;
        });
      }
      payload.new.likes && payload.new.likes.includes(currDbUser.id)
        ? (liked = true)
        : (liked = false);
      likes = payload.new.likes;
    };

    supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        handleInserts
      )
      .subscribe();
  }

  function share(id: string) {
    console.log(`Sharing post ${id}`);
  }

  function remove() {
    actionWarning.set({
      heading: "Delete post?",
      text: "Deleting a post can't be undone",
      func: async () => {
        if (currDbUser && currDbUser.id === user_id) {
          const { error } = await supabase.from("posts").delete().eq("id", id);
          if (!error) {
            setNotification("Post was deleted");
            // using location.href instead of goto, because I need a refresh to happen

            if ($page.route.id === "/posts/[postId]" && browser) {
              location.href = "/";
            } else if ($page.route.id !== "/posts/[postId]") {
              location.href = location.href;
            }
          }
        } else {
          console.log("User validation check failed");
        }
      },
      continueBtnText: "Delete",
    });
  }

  function togglePostVisibility() {
    postShown = !postShown;
  }

  async function getIsSaved() {
    if (currDbUser) {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("id", currDbUser.id)
        .single();
      if (data?.saved) {
        saved = data.saved.includes(id);
      }
    }
  }

  async function save() {
    if (currDbUser) {
      saved = !saved;

      saved
        ? setNotification("Post saved", `/saved`, "View all")
        : setNotification("Removed from saved");

      let allSavedPosts: string[];
      const { data: allSavedPostsData } = await supabase
        .from("users")
        .select()
        .eq("id", currDbUser.id)
        .single();

      if (allSavedPostsData.saved) {
        allSavedPosts = allSavedPostsData.saved;

        if (allSavedPosts.includes(id)) {
          allSavedPosts = allSavedPosts.filter((postId: string) => {
            return postId !== id;
          });
        } else {
          allSavedPosts.push(id);
        }
        const { error } = await supabase
          .from("users")
          .update({
            saved: allSavedPosts,
          })
          .eq("id", currDbUser.id);
      } else {
        allSavedPosts = [id];
        const { error } = await supabase
          .from("users")
          .update({
            saved: allSavedPosts,
          })
          .eq("id", currDbUser.id);
      }
    }
  }

  function getMenuElements() {
    if (currDbUser && currDbUser.id === user_id) {
      menuElements = authorPostOpts;
    } else {
      menuElements = defaultPostOpts;
    }
  }

  function handlePostClick(e: any) {
    if (!e.target.classList.contains("no-location-change")) {
      (isFeedPost || isChild) && goto(`/posts/${id}`);
    }
  }
</script>

{#if id && postCreator}
  {#if postShown}
    <div class="feed-page-post-wrp">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={handlePostClick}
        class="post font-weight-normal {isFeedPost || isChild ? 'pointer' : ''}"
      >
        <div class="post-left">
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <a
            on:mouseenter={() => {
              showUserCard = true;
            }}
            on:mouseleave={() => {
              showUserCard = false;
            }}
            class="grid-wrp"
            href="/{postCreator.url_username}"
          >
            <img
              src={postCreator.image_url}
              alt={postCreator.url_username}
              class="post-user-image rounded margin-top-4 image-height-40"
            />
            <UserCard
              imageUrl={postCreator.image_url}
              uid={postCreator.id}
              href={`/${postCreator.url_username}`}
              username={postCreator.url_username}
              displayedUsername={postCreator.displayed_username}
              userBio={postCreator.bio}
              bind:show={showUserCard}
            />
          </a>

          {#if !isChild && !isFeedPost}
            <div class="line-vertical"></div>
          {/if}
        </div>
        <div class="post-right grid-wrp">
          <div class="post-top mobile">
            <a href={`/${postCreator.url_username}`} class="grid-wrp">
              <img
                src={postCreator.image_url}
                alt={postCreator.url_username}
                class="post-user-image image-height-40 rounded margin-top-4"
              /></a
            >
            <div class="post-texts flex-between">
              <a
                href={`/${postCreator.url_username}`}
                class="post-username align-center">{postCreator.url_username}</a
              >
              <div class="align-center">
                <p class="even-less">{dayjs(created_at).fromNow()}</p>
                <HiddenMenu
                  btnClass="no-style post-menu flex-center-all button-element before-hover-anim post-action-m-block"
                  icon={ThreeDotsHoriz}
                  iconClass="small-post-icon"
                  wrpClass="dots-menu"
                  wrpClassVis="dots-menu-visible"
                  wrpClassHid=""
                  elements={menuElements}
                  authOnly
                />
              </div>
            </div>
          </div>
          {#if description}
            <p
              class={`post-description mobile pl-text ${image_urls && image_urls.length > 0 ? "post-description-w-img" : ""}`}
            >
              <LongHiddenText text={description} maxLength={maxChars} />
            </p>
          {/if}
          <div class="post-top desktop">
            <div class="post-texts">
              <div class="post-texts-top flex-between">
                <a
                  href={`/${postCreator.url_username}`}
                  class="post-username align-center"
                  >{postCreator.url_username}</a
                >
                <div class="align-center">
                  <p class="even-less">{dayjs(created_at).fromNow()}</p>
                  <HiddenMenu
                    btnClass="no-style post-menu flex-center-all button-element before-hover-anim post-action-m-block"
                    icon={ThreeDotsHoriz}
                    iconClass="small-post-icon"
                    wrpClass="dots-menu"
                    wrpClassVis="dots-menu-visible"
                    wrpClassHid=""
                    elements={menuElements}
                    authOnly
                  />
                </div>
              </div>
              {#if description}
                <p
                  class={`post-description pl-text ${image_urls && image_urls?.length > 0 ? "post-description-w-img" : ""}`}
                >
                  <LongHiddenText text={description} maxLength={maxChars} />
                </p>
              {/if}
            </div>
          </div>
          {#if image_urls && image_urls?.length > 0}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="grid-wrp">
              {#if isFeedPost}
                {#if image_urls.length > 1}
                  <div class="grid-wrp">
                    <div class="snap-swiper-x gap-10">
                      {#each image_urls as image}
                        <img
                          src={image}
                          alt="Post"
                          class={`post-image snap-swiper-item ${image_urls.length > 1 ? "post-image-has-sibling" : ""}`}
                        />
                      {/each}
                    </div>
                  </div>
                {:else}
                  <div class="grid-wrp">
                    <img
                      src={image_urls[0]}
                      alt="Post"
                      class="post-image post-image-no-sibling"
                    />
                  </div>
                {/if}
              {:else if image_urls.length > 1}
                <div class="snap-swiper-x gap-10">
                  {#each image_urls as image}
                    <img
                      src={image}
                      alt="Post"
                      class="post-image snap-swiper-item {image_urls.length > 0
                        ? 'post-image-has-sibling'
                        : ''}"
                    />
                  {/each}
                </div>
              {:else}
                <img
                  src={image_urls[0]}
                  alt="Post"
                  class="post-image post-image-no-sibling"
                />
              {/if}
            </div>
          {/if}
          <div class={currDbUser ? "post-bottom" : "post-bottom-no-auth"}>
            {#if currUser && currDbUser}
              <div class="flex-between">
                <div class="post-actions gap-15">
                  <button
                    class="post-action before-hover-anim rounded gap-3 align-center no-location-change"
                    on:click={(e) => {
                      e.preventDefault();
                      like();
                    }}
                  >
                    <HeartIcon
                      iconClass={`action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                    />
                    {#if likes?.length}
                      <span class={liked ? "liked-span-colored" : ""}>
                        {likes.length}
                      </span>
                    {/if}
                  </button>
                  <a
                    href={`/posts/${id}?comment`}
                    class="post-action before-hover-anim align-center gap-3 rounded button-link font-weight-normal"
                  >
                    <CommentIcon iconClass="action-icon comment-icon" />
                    {#if postComments?.length}
                      <span>
                        {postComments.length}
                      </span>
                    {/if}
                  </a>
                  <button
                    class="post-action before-hover-anim rounded no-location-change"
                    on:click={(e) => {
                      e.preventDefault();
                      share("slkadfjhalskjdfhlakjshdljah123456");
                    }}
                  >
                    <ShareIcon iconClass="action-icon share-icon" />
                  </button>
                </div>
                <div class="post-actions">
                  <button
                    class="post-action before-hover-anim rounded no-location-change"
                    on:click={(e) => {
                      e.preventDefault();
                      save();
                    }}
                  >
                    <SaveIcon
                      iconClass={`action-icon ${saved ? "saved-icon" : "save-icon"}`}
                    />
                  </button>
                </div>
              </div>
            {/if}
            {#if !currDbUser}
              <p class="even-less">
                {#if likes}
                  {likes.length > 0
                    ? likes.length === 1
                      ? `${likes.length} like`
                      : `${likes.length} likes`
                    : ""}
                {/if}
                {#if likes && postComments.length >= 1 && likes.length >= 1}
                  <span class="text-dot">·</span>
                {/if}
                {#if postComments}
                  {postComments.length > 0
                    ? postComments.length === 1
                      ? `${postComments.length} comment`
                      : `${postComments.length} comments`
                    : ""}
                {/if}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class={!isChild && !isFeedPost ? "feed-page-post-wrp" : ""}>
      {#if currDbUser && !isFeedPost && !isChild}
        <NewPostForm
          replyingTo={id}
          postIsChild
          showUnclickableControlls={false}
          wrpClass={postComments.length > 0 ? "feed-page-post-wrp" : ""}
        />
      {/if}
      <div class="post-comments-wrp" id="comments">
        {#if !isChild}
          {#if postComments && !isFeedPost}
            {#each postComments as { id, created_at, image_urls, description, likes, user_id }}
              <svelte:self
                isChild
                {id}
                {created_at}
                {image_urls}
                {description}
                {likes}
                {user_id}
              />
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  {:else}
    <div class="feed-page-post-wrp">
      <div
        class="alpha-bg-element padding-20 flex-between align-center post-hidden-dialog ab-app-dialog"
      >
        <p class="less">Post was hidden.</p>
        <button
          on:click={togglePostVisibility}
          class="desc-dots hover-before-height less">Show it again</button
        >
      </div>
    </div>
  {/if}
{/if}
