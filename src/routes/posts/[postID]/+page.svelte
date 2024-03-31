<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ReportIcon from "$lib/components/icons/ReportIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  import Comment from "$lib/components/Comment.svelte";
  import TopPostNav from "$lib/components/TopPostNav.svelte";
  import { page } from "$app/stores";
  import LongHiddenText from "$lib/components/LongHiddenText.svelte";
  import { browser } from "$app/environment";
  import type { dbUserData, dbPost, dbComment } from "$lib/types/db";
  import type { authUser } from "$lib/types/auth";
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  dayjs.extend(relativeTime);
  dayjs().format();

  export let data;

  let postID = data.postID;
  let currUser: authUser;
  let post: dbPost;
  let postComments: dbComment[] = [];
  let postCreator: dbUserData;
  let liked = false;
  let currDbUser: dbUserData;
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
      postComments = data;
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
      if (likes && !likes.includes(currDbUser.url_username)) {
        likes.push(currDbUser.url_username);
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
      getLikes(val.url_username);
      likesListener();
    }
  });

  async function getLikes(currUsername: string) {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postID);
    if (data && data[0].likes && data[0].likes.includes(currUsername)) {
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
      if (likes && !likes.includes(currDbUser.url_username)) {
        likes.push(currDbUser.url_username);
        post.likes = likes;
        const { error } = await supabase
          .from("posts")
          .update({ likes: likes })
          .eq("id", postID);
      } else {
        likes &&
          (likes = likes.filter((user: string) => {
            return user !== currDbUser.url_username;
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
        return user !== currDbUser.url_username;
      });
      payload.new.likes && payload.new.likes.includes(currDbUser.url_username)
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

  function commentCheck() {
    commentText = commentText.trim();
    if (commentText.length < 1) {
      commentPlaceholder = "Comment can't be empty";
      return false;
    } else {
      commentPlaceholder = "";
      return true;
    }
  }

  async function comment() {
    if (currUser) {
      if (commentCheck()) {
        await supabase.from("comments").insert({
          created_at: new Date().getTime(),
          post_id: post.id,
          user_id: currDbUser.id,
          text: commentText,
        });
        commentText = "";
      }
    } else {
      console.log("You have to be logged in to comment.");
    }
  }

  function share(id: string) {
    console.log(`Sharing post ${id}`);
  }

  function report() {
    console.log("Report function");
  }
</script>

<svelte:head>
  <title>{post ? `"${post.title}" - Futuregram` : "Loading post..."}</title>
</svelte:head>

<main class="feed-main">
  <TopPostNav />
  <div class="feed-posts-wrp">
    {#if post && postCreator}
      <div class="feed-post-wrp">
        <div class="feed-post">
          <div class="feed-post-left">
            <a href={`/${postCreator.url_username}`} class="grid-wrp">
              <img
                src={postCreator.image_url}
                alt={postCreator.url_username}
                class="feed-post-user-image image-height-40 radius-50 margin-top-4"
              />
            </a>
          </div>
          <div class="feed-post-right">
            <div class="feed-post-top-mobile">
              <a href={`/${postCreator.url_username}`} class="grid-wrp">
                <img
                  src={postCreator.image_url}
                  alt={postCreator.url_username}
                  class="feed-post-user-image image-height-40 radius-50 margin-top-4"
                /></a
              >
              <div class="feed-post-texts flex-between">
                <a
                  href={`/${postCreator.url_username}`}
                  class="feed-post-username">{postCreator.url_username}</a
                >
                <p class="even-less">{dayjs(post.created_at).fromNow()}</p>
              </div>
            </div>
            <div class="feed-post-top">
              <div class="feed-post-texts">
                <div class="feed-post-texts-top flex-between">
                  <a
                    href={`/${postCreator.url_username}`}
                    class="feed-post-username">{postCreator.url_username}</a
                  >
                  <p class="even-less">{dayjs(post.created_at).fromNow()}</p>
                </div>
                <p class="feed-post-description">
                  <LongHiddenText
                    text={post.description}
                    maxLength={maxChars}
                  />
                </p>
              </div>
            </div>
            <img
              src={post.image_url}
              alt={post.title}
              class="feed-post-image"
              on:dblclick={dbClickLike}
            />
            <p class="feed-post-description-mobile">
              <span class="less">{postCreator.url_username}: </span>
              <LongHiddenText text={post.description} maxLength={60} />
            </p>
            <div class="feed-post-bottom">
              <div class="flex-between">
                <div class="feed-post-actions">
                  {#if currUser && currDbUser}
                    <button
                      class="feed-post-action before-hover-anim"
                      on:click={like}
                    >
                      <HeartIcon
                        iconClass={`feed-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                      />
                    </button>
                  {:else}
                    <a
                      href="/login"
                      class="feed-post-action before-hover-anim button-link"
                    >
                      <HeartIcon iconClass="feed-action-icon heart-icon" />
                    </a>
                  {/if}
                  <button
                    class="feed-post-action before-hover-anim"
                    on:click={comment}
                  >
                    <CommentIcon iconClass="feed-action-icon comment-icon" />
                  </button>
                  <button
                    class="feed-post-action before-hover-anim"
                    on:click={() => {
                      share("slkadfjhalskjdfhlakjshdljah123456");
                    }}
                  >
                    <ShareIcon iconClass="feed-action-icon share-icon" />
                  </button>
                </div>
                <div class="feed-post-actions">
                  <button
                    class="feed-post-action before-hover-anim"
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
        <div class="feed-post-comments-wrp">
          {#if postComments}
            {#each postComments as comment}
              <Comment id={comment.id} />
            {/each}
          {/if}
        </div>
        <form
          class={`comment-input-wrp user-input-text user-input ${commentPlaceholder === "" ? "" : "form-error-input"}`}
          on:submit={(e) => {
            e.preventDefault();
            comment();
          }}
        >
          <input
            type="text"
            id="comment-input"
            placeholder={commentPlaceholder === ""
              ? "Comment your thoughts!"
              : commentPlaceholder}
            class={`no-style w-full comment-input ${commentPlaceholder === "" ? "" : "comment-input-error"}`}
            bind:value={commentText}
          />
          <button class="grid-wrp comment-button no-style button-element">
            <MessageIcon iconClass="image-height-1.5rem comment-input-icon" />
          </button>
        </form>
      </div>
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
