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
  import MessageIcon from "$lib/components/icons/MessageIcon.svelte";
  import CommentIcon from "../icons/CommentIcon.svelte";
  import type { MenuElement, ReplyingToComment } from "$lib/types/app";
  import CrossIcon from "../icons/CrossIcon.svelte";
  import { commentCheck } from "$lib/helper/formValidation";
  import { supabase } from "$lib/supabaseClient";
  import HiddenMenu from "$lib/components/ui/HiddenMenu.svelte";
  import ThreeDotsHoriz from "../icons/ThreeDotsHoriz.svelte";
  import { blockUser, report } from "$lib/helper/feedAdvanced";
  import SaveIcon from "../icons/SaveIcon.svelte";
  import { setNotification } from "$lib/helper/appNotifications";
  import UserImage from "../feed/UserImage.svelte";
  import { actionWarning } from "$lib/stores/app";

  dayjs.extend(relativeTime);
  dayjs().format();

  export let id: string;
  export let created_at: number;
  export let image_urls: string[];
  export let description: string;
  export let likes: string[];
  export let user_id: string;
  export let isFeedPost: boolean = false;
  export let commentActive: boolean = false;
  export let saved: boolean = false;
  export let isChild = false;

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
  let commentText = "";
  let commentPlaceholder = "";
  let firstId: string;
  let replying: ReplyingToComment;
  let postShown = true;
  let animationRunning = false;
  let heartX = 0;
  let heartY = 0;
  let menuElements: MenuElement[];

  const dbClickAnimationTimeout = 400;
  const heartSize = 70;

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
    console.log(data, error);

    if (data && data.length > 0) {
      postComments = data
        .sort((a: any, b: any) => {
          return a.likes.length - b.likes.length;
        })
        .reverse();
      firstId = postComments[0].id;
    }
    commentsListener();

    if (commentActive && browser) {
      document.getElementById("comment-input")?.focus();
      document.getElementById("comment-input")?.scrollIntoView();
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

  async function dbClickLike(e: any) {
    if (currUser) {
      let likes = [];
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id);
      data && data[0].likes && (likes = data[0].likes);

      animationRunning = true;

      console.log(e, e.clientX);

      heartX = e.offsetX;
      heartY = e.offsetY;

      setTimeout(() => {
        animationRunning = false;
      }, dbClickAnimationTimeout);

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

    commentPlaceholder = commentCheck(commentText).message;
    if (currUser) {
      if (commentCheck(commentText).isValid) {
        await supabase.from("posts").insert({
          created_at: new Date().getTime(),
          replying_to: id,
          user_id: currDbUser.id,
          description: commentText,
        });
        commentText = "";
      }
    } else {
      console.log("You have to be logged in to comment");
    }
  }

  function share(id: string) {
    console.log(`Sharing post ${id}`);
  }

  function clearReplying() {
    replying = null;
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
</script>

{#if id && postCreator}
  {#if postShown}
    <div class={isFeedPost ? "feed-page-post-wrp" : ""}>
      <div class="post {isChild ? 'm-left-20' : ''}">
        <div class="post-left">
          <UserImage
            imageUrl={postCreator.image_url}
            uid={postCreator.id}
            href={`/${postCreator.url_username}`}
            username={postCreator.url_username}
            displayedUsername={postCreator.displayed_username}
            userBio={postCreator.bio}
          />
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
          <p
            class={`post-description mobile pl-text ${image_urls?.length > 0 ? "post-description-w-img" : ""}`}
          >
            <LongHiddenText text={description} maxLength={maxChars} />
          </p>
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
              <p
                class={`post-description pl-text ${image_urls?.length > 0 ? "post-description-w-img" : ""}`}
              >
                <LongHiddenText text={description} maxLength={maxChars} />
              </p>
            </div>
          </div>
          {#if image_urls?.length > 0}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="grid-wrp relative dbclick-heart-wrp"
              on:dblclick={(e) => {
                dbClickLike(e);
              }}
            >
              {#if animationRunning}
                <div
                  style={`transform: rotate(${Math.floor(Math.random() * 2) === 0 ? Math.floor(Math.random() * 30) : -1 * Math.floor(Math.random() * 30)}deg);left:${heartX - heartSize / 2}px;top:${heartY - heartSize / 2}px`}
                  class="grid-wrp absolute"
                >
                  <HeartIcon iconClass="dbclick-heart-fade liked-heart-icon" />
                </div>
              {/if}

              {#if isFeedPost}
                {#if image_urls.length > 1}
                  <a href={`posts/${id}`} class="grid-wrp">
                    <div class="snap-swiper-x gap-10">
                      {#each image_urls as image}
                        <img
                          src={image}
                          alt="Post"
                          class={`post-image snap-swiper-item ${image_urls.length > 1 ? "post-image-has-sibling" : ""}`}
                        />
                      {/each}
                    </div>
                  </a>
                {:else}
                  <a href={`posts/${id}`} class="grid-wrp">
                    <img
                      src={image_urls[0]}
                      alt="Post"
                      class="post-image post-image-no-sibling"
                    />
                  </a>
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
                    class="post-action before-hover-anim rounded gap-3 align-center"
                    on:click={like}
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
                    on:click={save}
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
                {#if postComments.length >= 1}
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
      <div>
        {#if currDbUser && !isFeedPost && !isChild}
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
