<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import ThreeDotsHoriz from "$lib/components/icons/ThreeDotsHoriz.svelte";
  import HiddenMenu from "$lib/components/HiddenMenu.svelte";
  import type { DbUser, DbComment, DbReply } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import CommentReply from "$lib/components/CommentReply.svelte";
  import * as validation from "$lib/helper/formValidation";
  import type { ReplyingToComment } from "$lib/types/app";
  import { browser } from "$app/environment";
  import { blockUser, report } from "$lib/helper/feedAdvanced";
  import setNotification from "$lib/helper/appNotifications";
  import Post from "./Post.svelte";
  import UserImage from "./UserImage.svelte";

  export let id: string;
  export let feedComment: boolean = true;
  export let replying: ReplyingToComment = null;
  export let repliesShown: boolean = false;

  dayjs.extend(relativeTime);
  dayjs().format();

  let currUser: AuthUser;
  let currDbUser: DbUser;
  let comment: DbComment;
  let liked = false;
  let commentCreator: DbUser;
  let postCreator: DbUser;

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
        blockUser("random-id-45478-utfasdýasdýř87ř");
      },
      class: "menu-link red",
      text: "Block account",
    },
  ];

  const authorCommentOpts = [
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

  const postCreatorCommentOpts = [
    {
      type: "button",
      onClick: remove,
      class: "menu-link red",
      text: "Delete comment",
    },
    {
      type: "button",
      onClick: report,
      class: "menu-link red",
      text: "Report",
    },
    {
      type: "button",
      onClick: () => {
        blockUser("random-id-45478-utfasdýasdýř87ř");
      },
      class: "menu-link red",
      text: "Block account",
    },
  ];

  let editing = false;
  let editingValue = "";
  let editingValueLabel = "";
  let replies: DbReply[];

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
      res.data && (postCreator = res.data[0]);
    }
  }

  function showReplies() {
    repliesShown = !repliesShown;
  }

  function reply() {
    if (commentCreator && comment) {
      replying = {
        commentId: comment.id,
        commentCreator: commentCreator,
      };
    } else {
      console.log("Unable to reply before comment loaded.");
    }
  }

  function edit() {
    if (commentCreator.id === currDbUser.id) {
      editing = true;
      browser &&
        setTimeout(() => {
          document.getElementById(`comment-edit-${comment.id}`)?.focus();
        }, 0);
    }
  }

  async function remove() {
    if (
      commentCreator.id === currDbUser.id ||
      postCreator.id === currDbUser.id
    ) {
      comment &&
        (await supabase.from("comments").delete().eq("id", comment.id));
      const { data } = await supabase
        .from("comments")
        .select()
        .eq("id", comment.id);
      data && (comment = data[0]);
      setNotification("Comment deleted");
    }
  }

  async function finishEditing() {
    editingValue = editingValue.trim();
    editingValueLabel = validation.commentCheck(editingValueLabel).message;
    if (validation.commentCheck(editingValue).isValid) {
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
      setNotification("Comment saved!");
    }
  }

  async function getReplies() {
    const { data } = await supabase
      .from("replies")
      .select()
      .eq("comment_id", id);

    data && (replies = data);
    console.log("Replies are selected from the DB now");
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
        handleInserts
      )
      .subscribe();
  }

  function getMenuElements() {
    if (currDbUser) {
      if (currDbUser.id === commentCreator.id) {
        return authorCommentOpts;
      } else if (currDbUser.id === postCreator.id) {
        return postCreatorCommentOpts;
      }
    }
    return defaultCommentOpts;
  }
</script>

{#if comment}
  {#if commentCreator && postCreator}
    <div class={`post-comment ${feedComment ? "comment" : ""}`}>
      <div class="comment-left">
        <UserImage
          imageUrl={commentCreator.image_url}
          uid={commentCreator.id}
          imageClass="image-height-30"
          href={`/${commentCreator.url_username}`}
          username={commentCreator.url_username}
          displayedUsername={commentCreator.displayed_username}
          userBio={commentCreator.bio}
        />
      </div>
      <div class="comment-right">
        <div class="comment-top flex-between">
          <a
            href={`/${commentCreator.url_username}`}
            class={`post-username ${commentCreator.url_username === postCreator.url_username ? "grey-bg-text" : ""}`}
            >{commentCreator.url_username}</a
          >
          <div class="align-center">
            <p class="even-less comment-date">
              {dayjs(comment.created_at).fromNow()}
              {comment.edited ? "(edited)" : ""}
            </p>
            <HiddenMenu
              btnClass="no-style post-menu flex-center-all button-element before-hover-anim post-action-m-block"
              icon={ThreeDotsHoriz}
              iconClass="small-post-icon"
              wrpClass="dots-menu"
              wrpClassVis="dots-menu-visible"
              wrpClassHid=""
              elements={getMenuElements()}
              btnDisabled={editing}
              authOnly
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
              id={`comment-edit-${comment.id}`}
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
          <p class={`comment-text pl-text ${!currDbUser ? "desc-m-top" : ""}`}>
            {comment.text}
          </p>
        {/if}

        {#if currUser && currDbUser}
          <div class="flex-between">
            <div
              class={`post-actions comment-actions gap-15 ${!currDbUser ? "no-auth-c-reactions-count" : ""}`}
            >
              <button
                class="post-action before-hover-anim rounded gap-3 align-center"
                on:click={like}
              >
                <HeartIcon
                  iconClass={`action-icon comment-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                />
                {#if comment.likes?.length}
                  <span class={liked ? "liked-span-colored" : ""}>
                    {comment.likes.length}
                  </span>
                {/if}
              </button>
              <button
                class="post-action before-hover-anim rounded gap-3 align-center"
                on:click={reply}
              >
                <CommentIcon
                  iconClass="action-icon comment-action-icon comment-icon"
                />
                {#if replies?.length}
                  <span>
                    {replies.length}
                  </span>
                {/if}
              </button>
            </div>
          </div>
        {:else if (!currDbUser && comment.likes.length) || (!currDbUser && replies.length)}
          <div class="flex-between">
            <div
              class={`post-actions comment-actions gap-15 ${!currDbUser ? "no-auth-c-reactions-count" : ""}`}
            >
              <p
                class={`even-less align-center comment-reactions-count ${!currDbUser ? "m-left-0" : ""}`}
              >
                {#if comment.likes}
                  {comment.likes.length > 0
                    ? comment.likes.length === 1
                      ? `${comment.likes.length} like`
                      : `${comment.likes.length} likes`
                    : ""}
                {/if}
                {#if replies}
                  {#if replies.length >= 1}
                    <span class="text-dot">·</span>
                  {/if}
                  {replies.length > 0
                    ? replies.length === 1
                      ? `${replies.length} reply`
                      : `${replies.length} replies`
                    : ""}
                {/if}
              </p>
            </div>
          </div>
        {/if}
        {#if !feedComment}
          {#if replies.length > 0}
            {#if !repliesShown}
              <button
                class="no-style hover-before-height desc-dots less show-replies"
                on:click={showReplies}>show replies</button
              >
            {:else}
              <div class="replies-wrp">
                {#each replies as reply}
                  <CommentReply id={reply.id} />
                {/each}
              </div>
            {/if}
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}
