<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import ThreeDotsHoriz from "$lib/components/icons/ThreeDotsHoriz.svelte";
  import HiddenMenu from "$lib/components/HiddenMenu.svelte";
  import type { DBUserData, DBComment, DBPost } from "$lib/types/db";
  import type { AuthUser } from "$lib/types/auth";
  import * as validation from "$lib/helper/form-validation";
  dayjs.extend(relativeTime);
  dayjs().format();
  export let id: string;
  import { browser } from "$app/environment";

  let currUser: AuthUser;
  let currDbUser: DBUserData;
  let reply: DBComment;
  let liked = false;
  let replyCreator: DBUserData;
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

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getLikes(val.id);
  });

  async function getReply() {
    const { data, error } = await supabase
      .from("replies")
      .select()
      .eq("id", id);

    if (data) {
      reply = data[0];
      editingValue = data[0].text;
      getReplyCreator(data[0].user_id);
      getPostCreator();
    } else {
      console.log(`Error while getting a reply (${id})`);
    }
  }
  getReply();

  async function like() {
    if (currUser) {
      liked = !liked;
      let likes = [];
      const { data, error } = await supabase
        .from("replies")
        .select()
        .eq("id", id);
      data && data[0].likes && (likes = data[0].likes);
      if (likes && !likes.includes(currDbUser.id)) {
        likes.push(currDbUser.id);
        reply.likes = likes;
        const { error } = await supabase
          .from("replies")
          .update({ likes: likes })
          .eq("id", id);
      } else {
        likes &&
          (likes = likes.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        reply.likes = likes;
        const { error } = await supabase
          .from("replies")
          .update({ likes: likes })
          .eq("id", id);
      }
    } else {
      console.log("You have to be logged in to like posts.");
    }
  }

  async function getLikes(uid: string) {
    const { data, error } = await supabase
      .from("replies")
      .select()
      .eq("id", id);
    if (data && data[0].likes && data[0].likes.includes(uid)) {
      liked = true;
    }
  }

  async function getReplyCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data) {
      replyCreator = data[0];
    } else {
      console.log("Error while getting creator of comment");
    }
  }

  async function getPostCreator() {
    const { data } = await supabase
      .from("posts")
      .select()
      .eq("id", reply.post_id);
    if (data) {
      const res = await supabase
        .from("users")
        .select()
        .eq("id", data[0].user_id);
      res.data && (postCreator = res.data[0].url_username);
    }
  }

  function replyFunc() {
    console.log(`Replying to comment ${id}`);
  }

  function report() {
    console.log(`Report function\nFor comment ${id}`);
  }

  function block(uid: string) {
    console.log(`Block function for ${uid}`);
  }

  function edit() {
    if (replyCreator.id === currDbUser.id) {
      editing = true;
      browser &&
        setTimeout(() => {
          document.getElementById(`reply-edit-${reply.id}`)?.focus();
        }, 0);
    }
  }

  async function remove() {
    if (replyCreator.id === currDbUser.id) {
      reply && (await supabase.from("replies").delete().eq("id", reply.id));
      const { data } = await supabase
        .from("replies")
        .select()
        .eq("id", reply.id);
      data && (reply = data[0]);
    }
  }

  async function finishEditing() {
    editingValue = editingValue.trim();
    editingValueLabel = validation.editingValueCheck(editingValue);
    if (validation.editingValueCheck(editingValue) === "") {
      editing = false;
      await supabase
        .from("replies")
        .update({ text: editingValue, edited: true })
        .eq("id", reply.id);
      const { data } = await supabase
        .from("replies")
        .select()
        .eq("id", reply.id);
      data && (reply = data[0]);
    }
  }
</script>

{#if reply}
  {#if replyCreator && postCreator}
    <div class="post-comment comment-reply">
      <div class="comment-left">
        <a href={`/${replyCreator.url_username}`} class="grid-wrp">
          <img
            src={replyCreator.image_url}
            alt="Comment pfp"
            class="comment-user-image rounded image-height-30 margin-top-4"
          /></a
        >
      </div>
      <div class="comment-right">
        <div class="comment-top flex-between">
          <a
            href={`/${replyCreator.url_username}`}
            class={`post-username ${replyCreator.url_username === postCreator ? "grey-bg-text" : ""}`}
            >{replyCreator.url_username}</a
          >
          <div class="align-center">
            <p class="even-less comment-date">
              {dayjs(reply.created_at).fromNow()}
              {reply.edited ? "(edited)" : ""}
            </p>
            <HiddenMenu
              btnClass="no-style comments-menu flex-center-all button-element before-hover-anim"
              icon={ThreeDotsHoriz}
              iconClass="small-post-icon"
              wrpClass="dots-menu"
              wrpClassVis="dots-menu-visible"
              wrpClassHid=""
              elements={currDbUser && replyCreator.id === currDbUser.id
                ? userCommentOpts
                : defaultCommentOpts}
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
              id={`reply-edit-${reply.id}`}
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
          <p class="comment-text pl-text">{reply.text}</p>
        {/if}
        <div class="flex-between">
          <div class="post-actions reply-actions">
            {#if currUser && currDbUser}
              <button
                class="post-action before-hover-anim rounded gap-3 align-center bha-keep-scale"
                on:click={like}
              >
                <HeartIcon
                  iconClass={`action-icon comment-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                />
                {#if reply.likes?.length}
                  <span class={liked ? "liked-span-colored" : "even-less"}>
                    {reply.likes.length}
                  </span>
                {/if}
              </button>
              <button
                class="post-action before-hover-anim rounded gap-3 align-center bha-keep-scale"
                on:click={replyFunc}
              >
                <CommentIcon
                  iconClass="action-icon comment-action-icon comment-icon"
                />
                {#if reply.likes?.length}
                  <span class="even-less">
                    {reply.likes.length}
                  </span>
                {/if}
              </button>
            {/if}
            {#if !currDbUser}
              <p
                class={`even-less align-center comment-reactions-count ${!currDbUser ? "m-left-0" : ""}`}
              >
                {#if reply.likes}
                  {reply.likes.length <= 1
                    ? reply.likes.length === 0
                      ? "no likes"
                      : `${reply.likes.length} like`
                    : `${reply.likes.length} likes`}
                {:else}
                  no likes
                {/if}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
