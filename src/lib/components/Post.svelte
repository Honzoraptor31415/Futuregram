<script lang="ts">
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ReportIcon from "$lib/components/icons/ReportIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  import Comment from "$lib/components/Comment.svelte";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import type { DBUserData, DBComment } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import CommentIcon from "./icons/CommentIcon.svelte";
  import type { MenuElement, ReplyingToComment } from "$lib/types/app";
  import CrossIcon from "./icons/CrossIcon.svelte";
  import { commentCheck } from "$lib/helper/form-validation";
  import { supabase } from "$lib/supabaseClient";
  import HiddenMenu from "./HiddenMenu.svelte";
  import ThreeDotsHoriz from "./icons/ThreeDotsHoriz.svelte";
  import { blockUser, report } from "$lib/helper/feed-advanced";

  dayjs.extend(relativeTime);
  dayjs().format();

  export let id: string;
  export let title: string;
  export let created_at: number;
  export let image_url: string;
  export let description: string;
  export let likes: string[];
  export let user_id: string;
  export let feedPost: boolean = false;

  let currUser: AuthUser;
  let postComments: DBComment[] = [];
  let postCreator: DBUserData;
  let liked = false;
  let currDbUser: DBUserData;
  let maxChars = browser
    ? self.innerWidth > 970
      ? 69
      : self.innerWidth <= 970 && self.innerWidth >= 631
        ? 55
        : self.innerWidth <= 631
          ? 41
          : 0
    : 0;
  let commentText = "";
  let commentPlaceholder = "";
  let firstID: string;
  let replying: ReplyingToComment;
  let repliesShown: boolean = false;
  let postShown = true;

  const defaultPostOpts = feedPost
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
      ];

  const authorPostOpts: MenuElement[] = feedPost
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
          href: `/posts/${id}/edit`,
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
          href: `/posts/${id}/edit`,
        },
        {
          type: "button",
          onClick: remove,
          class: "menu-link red",
          text: "Delete post",
        },
      ];

  $: replying && browser && document.getElementById("comment-input")?.focus();

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
  });

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
  });

  async function getComments() {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("post_id", id);
    if (data && data.length > 0) {
      postComments = data
        .sort((a: any, b: any) => {
          return a.likes.length - b.likes.length;
        })
        .reverse();
      firstID = postComments[0].id;
    }
    commentsListener();
  }
  getComments();

  async function getPostCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data && data.length > 0) {
      postCreator = data[0];
    }
  }
  getPostCreator(user_id);

  async function dbClickLike() {
    if (currUser) {
      let likes = [];
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", id);
        liked = true;
      } else {
        console.log("You already liked this");
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  userDbData.subscribe((val: any) => {
    if (val) {
      currDbUser = val;
      getLikes(val.id);
      likesListener();
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
      let likes = [];
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", id);
      } else {
        likes &&
          (likes = likes.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", id);
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  function likesListener() {
    const handleInserts = (payload: any) => {
      console.log("Likes received!", payload);
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

  function commentsListener() {
    const handleInserts = (payload: any) => {
      console.log("Comment received!", payload);
      if (payload.new.post_id === id) {
        postComments = [...postComments, payload.new];
      }
    };

    supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        handleInserts
      )
      .subscribe();
  }

  async function comment() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);

    commentPlaceholder = commentCheck(commentText);
    if (currUser) {
      if (commentPlaceholder === "") {
        if (replying) {
          await supabase.from("replies").insert({
            created_at: new Date().getTime(),
            post_id: id,
            user_id: currDbUser.id,
            text: commentText,
            comment_id: replying.commentID,
          });
          commentText = "";
          replying = null;
          repliesShown = true;
        } else {
          await supabase.from("comments").insert({
            created_at: new Date().getTime(),
            post_id: id,
            user_id: currDbUser.id,
            text: commentText,
          });
          commentText = "";
        }
      }
    } else {
      console.log("You have to be logged in to comment");
    }
  }

  function share(id: string) {
    console.log(`Sharing post ${id}`);
  }

  function commentFromFeed() {
    console.log("Comment from the feed");
  }

  function clearReplying() {
    replying = null;
  }

  function remove() {
    console.log("Delete post function");
  }

  function getMenuElements() {
    if (currDbUser && currDbUser.id === postCreator.id) {
      return authorPostOpts;
    }
    return defaultPostOpts;
  }

  function togglePostVisibility() {
    postShown = !postShown;
  }
</script>

{#if id && postCreator}
  {#if postShown}
    <div class={feedPost ? "feed-page-post-wrp" : ""}>
      <div class="post">
        <div class="post-left">
          <a href={`/${postCreator.url_username}`} class="grid-wrp">
            <img
              src={postCreator.image_url}
              alt={postCreator.url_username}
              class="post-user-image image-height-40 rounded margin-top-4"
            />
          </a>
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
              <a href={`/${postCreator.url_username}`} class="post-username"
                >{postCreator.url_username}</a
              >
              <div class="align-center">
                <p class="even-less">{dayjs(created_at).fromNow()}</p>
                <HiddenMenu
                  btnClass="no-style comments-menu flex-center-all button-element before-hover-anim"
                  icon={ThreeDotsHoriz}
                  iconClass="small-post-icon"
                  wrpClass="dots-menu"
                  wrpClassVis="dots-menu-visible"
                  wrpClassHid=""
                  elements={getMenuElements()}
                  authOnly
                />
              </div>
            </div>
          </div>
          <p class="post-description mobile pl-text">
            <LongHiddenText text={description} maxLength={maxChars} />
          </p>
          <div class="post-top desktop">
            <div class="post-texts">
              <div class="post-texts-top flex-between">
                <a href={`/${postCreator.url_username}`} class="post-username"
                  >{postCreator.url_username}</a
                >
                <div class="align-center">
                  <p class="even-less">{dayjs(created_at).fromNow()}</p>
                  <HiddenMenu
                    btnClass="no-style comments-menu flex-center-all button-element before-hover-anim"
                    icon={ThreeDotsHoriz}
                    iconClass="small-post-icon"
                    wrpClass="dots-menu"
                    wrpClassVis="dots-menu-visible"
                    wrpClassHid=""
                    elements={getMenuElements()}
                    authOnly
                  />
                </div>
              </div>
              <p class="post-description pl-text">
                <LongHiddenText text={description} maxLength={maxChars} />
              </p>
            </div>
          </div>
          {#if feedPost}
            <a href={`posts/${id}`} class="grid-wrp">
              <img
                src={image_url}
                alt={title}
                class="post-image"
                on:dblclick={dbClickLike}
              /></a
            >
          {:else}
            <img
              src={image_url}
              alt={title}
              class="post-image"
              on:dblclick={dbClickLike}
            />
          {/if}
          <div class={currDbUser ? "post-bottom" : "post-bottom-no-auth"}>
            {#if currUser && currDbUser}
              <div class="flex-between">
                <div class="post-actions">
                  <button
                    class="post-action before-hover-anim rounded"
                    on:click={like}
                  >
                    <HeartIcon
                      iconClass={`action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                    />
                  </button>
                  {#if feedPost}
                    <button
                      on:click={commentFromFeed}
                      class="post-action before-hover-anim rounded button-link"
                    >
                      <CommentIcon iconClass="action-icon comment-icon" />
                    </button>
                  {/if}
                  <button
                    class="post-action before-hover-anim rounded"
                    on:click={() => {
                      share("slkadfjhalskjdfhlakjshdljah123456");
                    }}
                  >
                    <ShareIcon iconClass="action-icon share-icon" />
                  </button>
                </div>
                <div class="post-actions">
                  <button
                    class="post-action before-hover-anim rounded"
                    on:click={() => {
                      report("post", id);
                    }}
                  >
                    <ReportIcon iconClass="action-icon report-icon" />
                  </button>
                </div>
              </div>
            {/if}
            <p class="even-less">
              {#if likes}
                {likes.length <= 1
                  ? likes.length === 0
                    ? "no likes"
                    : `${likes.length} like`
                  : `${likes.length} likes`}
              {:else}
                no likes
              {/if}
              <span class="text-dot">·</span>
              {#if postComments}
                {postComments.length <= 1
                  ? postComments.length === 0
                    ? "no comments"
                    : `${postComments.length} comment`
                  : `${postComments.length} comments`}
              {:else}
                no comments
              {/if}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="post-comments-wrp">
          {#if postComments}
            {#if feedPost}
              {#if firstID}
                <Comment
                  bind:replying
                  {repliesShown}
                  id={firstID}
                  feedComment={true}
                />
              {/if}
            {:else}
              {#each postComments as comment}
                <Comment
                  bind:replying
                  {repliesShown}
                  id={comment.id}
                  feedComment={false}
                />
              {/each}
            {/if}
          {/if}
        </div>
        {#if postComments.length > 0 && !feedPost && currDbUser}
          <form
            class={`comment-input-wrp user-input-text main-bg-blurry ${commentPlaceholder === "" ? "" : "form-error-input"}`}
            on:submit={(e) => {
              e.preventDefault();
              comment();
            }}
          >
            {#if replying}
              <span class="tagged-replying align-center min-w-fit">
                <button
                  type="button"
                  on:click={clearReplying}
                  class="no-style grid-wrp min-w-fit pointer button-element hover-opacity"
                >
                  <CrossIcon iconClass="image-height-15 white-icon" />
                </button>
                <span class="even-less">
                  @{replying.commentCreator.url_username}
                </span>
              </span>
            {/if}
            <input
              autocomplete="off"
              type="text"
              id="comment-input"
              placeholder={replying
                ? `Replying to ${replying.commentCreator.id === currDbUser.id ? "your" : `${replying.commentCreator.url_username}'s`} comment`
                : "Comment your thoughts!"}
              class={`no-style w-full comment-input ${commentPlaceholder === "" ? "" : "comment-input-error"}`}
              bind:value={commentText}
            />
            <button
              type="submit"
              class="grid-wrp comment-button no-style button-element min-w-fit"
            >
              <MessageIcon iconClass="image-height-1.5rem comment-input-icon" />
            </button>
          </form>
        {/if}
      </div>
    </div>
  {:else}
    <div class="feed-page-post-wrp">
      <div
        class="alpha-bg-element flex-between align-center post-hidden-dialog"
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
