<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import ThreeDotsHoriz from "$lib/components/icons/ThreeDotsHoriz.svelte";
  import { browser } from "$app/environment";
  dayjs.extend(relativeTime);
  dayjs().format();

  export let id: string;

  let currUser: any;
  let currDbUser: any;
  let comment: any;
  let liked = false;
  let commentCreator: any;
  let menuVisible = false;

  loggedInUser.subscribe((val: any) => {
    currUser = val;
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getLikes(val.url_username);
  });

  async function getComment() {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("id", id);

    if (data) {
      comment = data[0];
      getCommentCreator(data[0].user_id);
    } else {
      console.log(`Error while getting a comment (${id})`);
    }
  }
  getComment();

  async function like() {
    if (currUser) {
      liked = !liked;
      let likes = [];
      const { data, error } = await supabase
        .from("comments")
        .select()
        .eq("id", id);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.url_username)) {
        likes.push(currDbUser.url_username);
        comment.likes = likes;
        const { error } = await supabase
          .from("comments")
          .update({ likes: likes })
          .eq("id", id);
      } else {
        likes &&
          (likes = likes.filter((user: any) => {
            return user !== currDbUser.url_username;
          }));
        comment.likes = likes;
        const { error } = await supabase
          .from("comments")
          .update({ likes: likes })
          .eq("id", id);
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  async function getLikes(currUsername: string) {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("id", id);
    if (data && data[0].likes && data[0].likes.includes(currUsername)) {
      liked = true;
    }
  }

  async function getCommentCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data) {
      commentCreator = data[0];
    } else {
      console.log("Error while getting creator of comment");
    }
  }

  function share() {
    console.log(`Sharing post ${id}`);
  }

  function showReplies() {
    console.log(`Show replies function`);
  }

  function reply() {
    console.log(`Replying to comment ${id}`);
  }

  function report() {
    console.log(`Report function\nFor comment ${id}`);
  }

  browser &&
    document.addEventListener("click", () => {
      menuVisible = false;
    });

  function menu() {
    menuVisible = !menuVisible;
  }
</script>

{#if comment}
  {#if commentCreator}
    <div class="feed-post-comment">
      <div class="feed-comment-left">
        <a href={`/${commentCreator.url_username}`} class="grid-wrp">
          <img
            src={commentCreator.image_url}
            alt="Comment pfp"
            class="feed-comment-user-image"
          /></a
        >
      </div>
      <div class="feed-comment-right">
        <div class="feed-comment-top flex-between">
          <a href={`/${commentCreator.url_username}`} class="feed-post-username"
            >{commentCreator.url_username}</a
          >
          <div class="comment-top-right">
            <p class="even-less comment-date">
              {dayjs(1710694355073).fromNow()}
            </p>
            <button
              on:click={(e) => {
                e.stopPropagation();
                menu();
              }}
              class="no-style comments-menu button-element before-hover-anim"
            >
              <ThreeDotsHoriz iconClass="small-post-icon" />
              <div
                class={`dots-menu ${menuVisible ? "dots-menu-visible" : ""}`}
              >
                <button class="menu-link red" on:click={report}>Report</button>
                <button class="menu-link red">Block account</button>
              </div>
            </button>
          </div>
        </div>
        <p class="feed-comment-text">{comment.text}</p>
        <div class="flex-between">
          <div class="feed-post-actions">
            {#if currUser && currDbUser}
              <button
                class="feed-post-action before-hover-anim"
                on:click={like}
              >
                <HeartIcon
                  iconClass={`feed-action-icon comment-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                />
              </button>
            {:else}
              <a
                href="/login"
                class="feed-post-action before-hover-anim button-link"
              >
                <HeartIcon
                  iconClass="feed-action-icon comment-action-icon heart-icon"
                />
              </a>
            {/if}
            <button class="feed-post-action before-hover-anim" on:click={reply}>
              <CommentIcon
                iconClass="feed-action-icon comment-action-icon comment-icon"
              />
            </button>
            <button class="feed-post-action before-hover-anim" on:click={share}>
              <ShareIcon
                iconClass="feed-action-icon comment-action-icon share-icon"
              />
            </button>
            <p class="even-less comment-reactions-count">
              {#if comment.likes}
                {comment.likes.length <= 1
                  ? comment.likes.length === 0
                    ? "no likes"
                    : `${comment.likes.length} like`
                  : `${comment.likes.length} likes`}
              {:else}
                no likes
              {/if}
              <span class="text-dot">·</span>
              1 reply
            </p>
          </div>
        </div>
        <button
          class="no-style hover-before-height desc-dots less"
          on:click={showReplies}>show replies</button
        >
      </div>
    </div>
  {/if}
{/if}
