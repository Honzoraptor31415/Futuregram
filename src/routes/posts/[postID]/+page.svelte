<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ReportIcon from "$lib/components/icons/ReportIcon.svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import ThreeDotsHoriz from "$lib/components/icons/ThreeDotsHoriz.svelte";
  dayjs.extend(relativeTime);
  dayjs().format();

  export let data;

  let postID = data.postID;
  let currUser: any;
  let post: any;
  let postComments: any;
  let postCreator: any;
  let liked = false;
  let currDbUser: any;
  let descShowed = false;

  async function getAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    currUser = data.user;
    getDbUser(data.user?.user_metadata.db_id);
  }

  getAuthUser();

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
  }
  getComments();

  async function getPostCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data && data.length > 0) {
      postCreator = data[0];
    }

    console.log(data, error);
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

  async function getDbUser(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data) {
      currDbUser = data[0];
      getLikes(data[0].url_username);
    } else {
      console.log("No user with such ID");
    }
  }

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
          (likes = likes.filter((user: any) => {
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

  async function getCommentCreator(uid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data) {
      return data[0];
    } else {
      console.log("Error while getting user");
    }
  }

  function comment() {
    console.log("Comment function");
  }

  function share(type: string, id: string) {
    if (type === "comment") {
      console.log(`Sharing comment ${id}`);
    } else {
      console.log(`Sharing post ${id}`);
    }
  }

  function report() {
    console.log("Report function");
  }

  function showmore() {
    descShowed = !descShowed;
  }

  function commentLike(commentId: string) {
    console.log(`Like function\nLiked comment: ${commentId}`);
  }

  function showReplies(commentId: string) {
    console.log(`Show replies function\nComment: ${commentId}`);
  }

  function reply(commentId: string) {
    console.log(`Replying to comment ${commentId}`);
  }
</script>

<main class="feed-main">
  <div class="feed-posts-wrp">
    {#if post && postCreator}
      <div class="feed-post-wrp">
        <div class="feed-post">
          <div class="feed-post-left">
            <a href={`/${postCreator.url_username}`} class="grid-wrp">
              <img
                src={postCreator.image_url}
                alt={postCreator.url_username}
                class="feed-post-user-image"
              />
            </a>
          </div>
          <div class="feed-post-right">
            <div class="feed-post-top-mobile">
              <a href={`/${postCreator.url_username}`} class="grid-wrp">
                <img
                  src={postCreator.image_url}
                  alt={postCreator.url_username}
                  class="feed-post-user-image"
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
                  {#if post.description.length < 50}
                    {post.description}
                  {:else}
                    {#if descShowed}
                      {post.description}
                    {:else}
                      {post.description.slice(0, 45)}
                    {/if}
                    {#if descShowed}
                      <button
                        on:click={showmore}
                        class="desc-dots showed-desc-dots hover-before-height"
                        ><span class="less">less</span></button
                      >
                    {:else}
                      <button
                        on:click={showmore}
                        class="desc-dots hover-before-height"
                        ><span class="less">... more</span></button
                      >
                    {/if}
                  {/if}
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
              {post.description}
            </p>
            <div class="feed-post-bottom">
              <div class="flex-between">
                <div class="feed-post-actions">
                  {#if currUser && currDbUser}
                    <button class="feed-post-action" on:click={like}>
                      <HeartIcon
                        iconClass={`feed-action-icon ${liked ? "liked-heart-icon" : "heart-icon"}`}
                      />
                    </button>
                  {:else}
                    <a href="/login" class="feed-post-action button-link">
                      <HeartIcon iconClass="feed-action-icon heart-icon" />
                    </a>
                  {/if}
                  <button class="feed-post-action" on:click={comment}>
                    <CommentIcon iconClass="feed-action-icon comment-icon" />
                  </button>
                  <button
                    class="feed-post-action"
                    on:click={() => {
                      share("post", "slkadfjhalskjdfhlakjshdljah123456");
                    }}
                  >
                    <ShareIcon iconClass="feed-action-icon share-icon" />
                  </button>
                </div>
                <div class="feed-post-actions">
                  <button class="feed-post-action" on:click={report}>
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
              {#await getCommentCreator(comment.user_id) then commentCreator}
                <div class="feed-post-comment">
                  <div class="feed-comment-left">
                    <a
                      href={`/${commentCreator.url_username}`}
                      class="grid-wrp"
                    >
                      <img
                        src={commentCreator.image_url}
                        alt="Comment pfp"
                        class="feed-comment-user-image"
                      /></a
                    >
                  </div>
                  <div class="feed-comment-right">
                    <div class="feed-comment-top flex-between">
                      <a
                        href={`/${commentCreator.url_username}`}
                        class="feed-post-username"
                        >{commentCreator.url_username}</a
                      >
                      <div class="comment-top-right">
                        <p class="even-less comment-date">
                          {dayjs(1710694355073).fromNow()}
                        </p>
                        <button class="no-style comments-menu feed-post-action">
                          <ThreeDotsHoriz iconClass="small-post-icon" />
                        </button>
                      </div>
                    </div>
                    <p class="feed-comment-text">
                      {comment.text}
                    </p>
                    <div class="flex-between">
                      <div class="feed-post-actions">
                        {#if currUser && currDbUser}
                          <button
                            class="feed-post-action"
                            on:click={() => {
                              commentLike("some-id-123456789-idunnoo");
                            }}
                          >
                            <HeartIcon
                              iconClass="feed-action-icon comment-action-icon heart-icon"
                            />
                          </button>
                        {:else}
                          <a href="/login" class="feed-post-action button-link">
                            <HeartIcon
                              iconClass="feed-action-icon comment-action-icon heart-icon"
                            />
                          </a>
                        {/if}
                        <button
                          class="feed-post-action"
                          on:click={() => {
                            reply("yet-another-random-id-068229875");
                          }}
                        >
                          <CommentIcon
                            iconClass="feed-action-icon comment-action-icon comment-icon"
                          />
                        </button>
                        <button
                          class="feed-post-action"
                          on:click={() => {
                            share(
                              "comment",
                              "dajkshdflkjhlkjhlkhblahblah-126291029384756",
                            );
                          }}
                        >
                          <ShareIcon
                            iconClass="feed-action-icon comment-action-icon share-icon"
                          />
                        </button>
                        <p class="even-less comment-reactions-count">
                          1 like
                          <span class="text-dot">·</span>
                          1 reply
                        </p>
                      </div>
                    </div>
                    <button
                      class="no-style hover-before-height desc-dots less"
                      on:click={() => {
                        showReplies(
                          "some-random-id-again-12345ř434567_42069yeah",
                        );
                      }}>show replies</button
                    >
                  </div>
                </div>
              {/await}
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
