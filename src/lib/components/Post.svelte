<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
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
  import type { DBUserData, DBPost, DBComment } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import CommentIcon from "./icons/CommentIcon.svelte";
  import type { ReplyingToComment } from "$lib/types/app";
  import CrossIcon from "./icons/CrossIcon.svelte";
  import { commentCheck } from "$lib/helper/form-validation";
  dayjs.extend(relativeTime);
  dayjs().format();

  export let postID: string;
  export let feedPost: boolean = false;
  let currUser: AuthUser;
  let post: DBPost;
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
    getPost();
    getComments();
  });

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
  });

  async function getPost() {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postID);

    if (data && data.length > 0) {
      post = data[0];
      getPostCreator(data[0].user_id);
    }
  }
  getPost();

  async function getComments() {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("post_id", postID);
    if (data && data.length > 0) {
      postComments = data
        .sort((a, b) => {
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

  async function dbClickLike() {
    if (currUser) {
      let likes = [];
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", postID);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        post.likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", postID);
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
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postID);
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
        .eq("id", postID);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        post.likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", postID);
      } else {
        likes &&
          (likes = likes.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        post.likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", postID);
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  function likesListener() {
    const handleInserts = (payload: any) => {
      console.log("Likes received!", payload);
      post.likes = post.likes.filter((user: string) => {
        return user !== currDbUser.id;
      });
      payload.new.likes && payload.new.likes.includes(currDbUser.id)
        ? (liked = true)
        : (liked = false);
      post.likes = payload.new.likes;
    };

    supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        handleInserts,
      )
      .subscribe();
  }

  function commentsListener() {
    const handleInserts = (payload: any) => {
      console.log("Comment received!", payload);
      if (payload.new.post_id === postID) {
        postComments = [...postComments, payload.new];
      }
    };

    supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        handleInserts,
      )
      .subscribe();
  }

  async function comment() {
    commentPlaceholder = commentCheck(commentText);
    if (currUser) {
      if (commentCheck(commentText) === "") {
        if (replying) {
          await supabase.from("replies").insert({
            created_at: new Date().getTime(),
            post_id: post.id,
            user_id: currDbUser.id,
            text: commentText,
            comment_id: replying.commentID,
          });
          commentText = "";
          replying = null;
        } else {
          await supabase.from("comments").insert({
            created_at: new Date().getTime(),
            post_id: post.id,
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

  function report() {
    console.log("Report function");
  }

  function commentFromFeed() {
    console.log("Comment from the feed");
  }

  function clearReplying() {
    replying = null;
  }
</script>

{#if post && postCreator}
  <div class={`feed-post-wrp ${feedPost ? "feed-page-post-wrp" : ""}`}>
    <div class="feed-post">
      <div class="feed-post-left">
        <a href={`/${postCreator.url_username}`} class="grid-wrp">
          <img
            src={postCreator.image_url}
            alt={postCreator.url_username}
            class="feed-post-user-image image-height-40 rounded margin-top-4"
          />
        </a>
      </div>
      <div class="feed-post-right grid-wrp">
        <div class="feed-post-top-mobile">
          <a href={`/${postCreator.url_username}`} class="grid-wrp">
            <img
              src={postCreator.image_url}
              alt={postCreator.url_username}
              class="feed-post-user-image image-height-40 rounded margin-top-4"
            /></a
          >
          <div class="feed-post-texts flex-between">
            <a href={`/${postCreator.url_username}`} class="feed-post-username"
              >{postCreator.url_username}</a
            >
            <p class="even-less">{dayjs(post.created_at).fromNow()}</p>
          </div>
        </div>
        <p class="feed-post-description mobile pl-text">
          <LongHiddenText text={post.description} maxLength={maxChars} />
        </p>
        <div class="feed-post-top">
          <div class="feed-post-texts">
            <div class="feed-post-texts-top flex-between">
              <a
                href={`/${postCreator.url_username}`}
                class="feed-post-username">{postCreator.url_username}</a
              >
              <p class="even-less">{dayjs(post.created_at).fromNow()}</p>
            </div>
            <p class="feed-post-description pl-text">
              <LongHiddenText text={post.description} maxLength={maxChars} />
            </p>
          </div>
        </div>
        {#if feedPost}
          <a href={`posts/${post.id}`} class="grid-wrp">
            <img
              src={post.image_url}
              alt={post.title}
              class="feed-post-image"
              on:dblclick={dbClickLike}
            /></a
          >
        {:else}
          <img
            src={post.image_url}
            alt={post.title}
            class="feed-post-image"
            on:dblclick={dbClickLike}
          />
        {/if}
        <div class="feed-post-bottom">
          <div class="flex-between">
            <div class="feed-post-actions">
              {#if currUser && currDbUser}
                <button
                  class="feed-post-action before-hover-anim rounded"
                  on:click={like}
                >
                  <HeartIcon
                    iconClass={`feed-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                  />
                </button>
                {#if feedPost}
                  <button
                    on:click={commentFromFeed}
                    class="feed-post-action before-hover-anim rounded button-link"
                  >
                    <CommentIcon iconClass="feed-action-icon comment-icon" />
                  </button>
                {/if}
              {:else}
                <a
                  href="/login"
                  class="feed-post-action before-hover-anim rounded button-link"
                >
                  <HeartIcon iconClass="feed-action-icon heart-icon" />
                </a>
                {#if feedPost}
                  <a
                    href="/login"
                    class="feed-post-action before-hover-anim rounded button-link"
                  >
                    <CommentIcon iconClass="feed-action-icon comment-icon" />
                  </a>
                {/if}
              {/if}
              <button
                class="feed-post-action before-hover-anim rounded"
                on:click={() => {
                  share("slkadfjhalskjdfhlakjshdljah123456");
                }}
              >
                <ShareIcon iconClass="feed-action-icon share-icon" />
              </button>
            </div>
            <div class="feed-post-actions">
              <button
                class="feed-post-action before-hover-anim rounded"
                on:click={report}
              >
                <ReportIcon iconClass="feed-action-icon report-icon" />
              </button>
            </div>
          </div>
          <p class="even-less">
            {#if post.likes}
              {post.likes.length <= 1
                ? post.likes.length === 0
                  ? "no likes"
                  : `${post.likes.length} like`
                : `${post.likes.length} likes`}
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
      <div class="feed-post-comments-wrp">
        {#if postComments}
          {#if feedPost}
            {#if firstID}
              <Comment bind:replying id={firstID} feedComment={true} />
            {/if}
          {:else}
            {#each postComments as comment}
              <Comment bind:replying id={comment.id} feedComment={false} />
            {/each}
          {/if}
        {/if}
      </div>
      {#if !feedPost}
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
                @{replying.commentUsername}
              </span>
            </span>
          {/if}
          <input
            autocomplete="off"
            type="text"
            id="comment-input"
            placeholder={replying
              ? `Replying to ${replying.commentUsername}'s comment`
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
{/if}
