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
  import HiddenMenu from "$lib/components/HiddenMenu.svelte";
  import type { DBUserData, DBComment, DBPost, DBReply } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import CommentReply from "$lib/components/CommentReply.svelte";
  dayjs.extend(relativeTime);
  dayjs().format();
  export let id: string;
  import * as validation from "$lib/helper/form-validation";
  import type { ReplyingToComment } from "$lib/types/app";
  export let feedComment: boolean = true;
  export let replying: ReplyingToComment = null;

  let currUser: AuthUser;
  let currDbUser: DBUserData;
  let comment: DBComment;
  let liked = false;
  let commentCreator: DBUserData;
  let postCreator: string;
  const defaultCommentOpts = [
    {
      type: "button",
      onClick: report,
      class: "menu-link red",
      text: "Report",
    },
    {
      type: "button",
      onClick: () => {
        block("random-id-45478-utfasdýasdýř87ř");
      },
      class: "menu-link red",
      text: "Block account",
    },
  ];
  const userCommentOpts = [
    {
      type: "button",
      onClick: edit,
      class: "menu-link",
      text: "Edit",
    },
    {
      type: "button",
      onClick: remove,
      class: "menu-link red",
      text: "Delete comment",
    },
  ];
  let editing = false;
  let editingValue = "";
  let editingValueLabel = "";
  let replies: DBReply[];

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getLikes(val.id);
  });

  async function getComment() {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("id", id);

    if (data) {
      comment = data[0];
      editingValue = data[0].text;
      getCommentCreator(data[0].user_id);
      getPostCreator();
      repliesListener();
    } else {
      console.log(`Error while getting a reply (${id})`);
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
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        comment.likes = likes;
        const { error } = await supabase
          .from("comments")
          .update({ likes: likes })
          .eq("id", id);
      } else {
        likes &&
          (likes = likes.filter((user: string) => {
            return user !== currDbUser.id;
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

  async function getLikes(uid: string) {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("id", id);
    if (data && data[0].likes && data[0].likes.includes(uid)) {
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

  async function getPostCreator() {
    const { data } = await supabase
      .from("posts")
      .select()
      .eq("id", comment.post_id);
    if (data) {
      const res = await supabase
        .from("users")
        .select()
        .eq("id", data[0].user_id);
      res.data && (postCreator = res.data[0].url_username);
    }
  }

  function share() {
    console.log(`Sharing post ${id}`);
  }

  function showReplies() {
    console.log(`Show replies function`);
  }

  function reply() {
    commentCreator && comment
      ? (replying = {
          commentID: comment.id,
          commentUsername: commentCreator.url_username,
        })
      : console.log("Unable to reply before comment loaded.");
  }

  function report() {
    console.log(`Report function\nFor comment ${id}`);
  }

  function block(uid: string) {
    console.log(`Block function for ${uid}`);
  }

  function edit() {
    if (commentCreator.id === currDbUser.id) {
      editing = true;
    }
  }

  async function remove() {
    if (commentCreator.id === currDbUser.id) {
      comment &&
        (await supabase.from("comments").delete().eq("id", comment.id));
      const { data } = await supabase
        .from("comments")
        .select()
        .eq("id", comment.id);
      data && (comment = data[0]);
    }
  }

  async function finishEditing() {
    editingValue = editingValue.trim();
    editingValueLabel = validation.editingValueCheck(editingValueLabel);
    if (validation.editingValueCheck(editingValue) === "") {
      editing = false;
      await supabase
        .from("comments")
        .update({ text: editingValue, edited: true })
        .eq("id", comment.id);
      const { data } = await supabase
        .from("comments")
        .select()
        .eq("id", comment.id);
      data && (comment = data[0]);
    }
  }

  async function getReplies() {
    const { data } = await supabase
      .from("replies")
      .select()
      .eq("comment_id", id);

    data && (replies = data);
  }

  getReplies();

  function repliesListener() {
    const handleInserts = (payload: any) => {
      console.log("Comment received!", payload);
      if (payload.new.comment_id === comment.id) {
        replies = [...replies, payload.new];
      }
    };

    supabase
      .channel("replies")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "replies" },
        handleInserts,
      )
      .subscribe();
  }
</script>

{#if comment}
  {#if commentCreator && postCreator}
    <div class={`feed-post-comment ${feedComment ? "comment-in-feed" : ""}`}>
      <div class="feed-comment-left">
        <a href={`/${commentCreator.url_username}`} class="grid-wrp">
          <img
            src={commentCreator.image_url}
            alt="Comment pfp"
            class="feed-comment-user-image rounded image-height-30 margin-top-4"
          /></a
        >
      </div>
      <div class="feed-comment-right">
        <div class="feed-comment-top flex-between">
          <a
            href={`/${commentCreator.url_username}`}
            class={`feed-post-username ${commentCreator.url_username === postCreator ? "grey-bg-text" : ""}`}
            >{commentCreator.url_username}</a
          >
          <div class="comment-top-right">
            <p class="even-less comment-date">
              {dayjs(comment.created_at).fromNow()}
              {comment.edited ? "(edited)" : ""}
            </p>
            <HiddenMenu
              btnClass="no-style comments-menu flex-center-all button-element before-hover-anim"
              icon={ThreeDotsHoriz}
              iconClass="small-post-icon"
              wrpClass="dots-menu"
              wrpClassVis="dots-menu-visible"
              wrpClassHid=""
              elements={currDbUser && commentCreator.id === currDbUser.id
                ? userCommentOpts
                : defaultCommentOpts}
              btnDisabled={editing}
            />
          </div>
        </div>
        {#if editing}
          <form
            on:submit={(e) => {
              e.preventDefault();
              finishEditing();
            }}
            class="flex-between edit-comment-wrp"
          >
            <textarea
              id="comment-edit"
              class="no-style no-resize comment-edit-input"
              bind:value={editingValue}
            ></textarea>
            <div class="editing-buttons">
              <button
                type="button"
                class="desc-dots hover-before-height"
                on:click={() => {
                  editing = false;
                }}
              >
                <span class="less">Cancel</span>
              </button>
              <button type="submit" class="desc-dots hover-before-height">
                Save
              </button>
            </div>
          </form>
        {:else}
          <p class="feed-comment-text pl-text">{comment.text}</p>
        {/if}
        <div class="flex-between">
          <div class="feed-post-actions comment-actions">
            {#if currUser && currDbUser}
              <button
                class="feed-post-action before-hover-anim rounded"
                on:click={like}
              >
                <HeartIcon
                  iconClass={`feed-action-icon comment-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                />
              </button>
            {:else}
              <a
                href="/login"
                class="feed-post-action before-hover-anim button-link rounded"
              >
                <HeartIcon
                  iconClass="feed-action-icon comment-action-icon heart-icon"
                />
              </a>
            {/if}
            <button
              class="feed-post-action before-hover-anim rounded"
              on:click={reply}
            >
              <CommentIcon
                iconClass="feed-action-icon comment-action-icon comment-icon"
              />
            </button>
            <button
              class="feed-post-action before-hover-anim rounded"
              on:click={share}
            >
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
        {#if !feedComment}
          {#if replies.length > 0}
            <button
              class="no-style hover-before-height desc-dots less"
              on:click={showReplies}>show replies</button
            >
            <div class="replies-wrp">
              {#each replies as reply}
                <CommentReply id={reply.id} />
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}
