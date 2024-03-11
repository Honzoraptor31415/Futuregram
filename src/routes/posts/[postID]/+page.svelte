<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ReportIcon from "$lib/components/icons/ReportIcon.svelte";
  export let data;

  let postID = data.postID;
  let currUser: any;
  let post: any;

  async function getAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    currUser = data;
  }

  getAuthUser();

  async function getPost() {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postID);

    if (data && data.length > 0) {
      post = data[0];
    }
  }

  getPost();

  function like() {
    console.log("Like function");
  }

  function comments() {
    console.log("Show comments icon");
  }

  function share() {
    console.log("Show share dialog function");
  }

  function report() {
    console.log("Report function");
  }
</script>

<main class="feed-main">
  <div class="feed-posts-wrp">
    {#if post}
      <div class="feed-post">
        <div class="feed-post-left">
          <img
            src={post.user_image}
            alt={post.created_by_username}
            class="feed-post-user-image"
          />
        </div>
        <div class="feed-post-right">
          <div class="feed-post-top-mobile">
            <img
              src={post.user_image}
              alt={post.created_by_username}
              class="feed-post-user-image"
            />
            <p class="feed-post-username">{post.created_by_username}</p>
          </div>
          <div class="feed-post-top">
            <div class="feed-post-texts">
              <p class="feed-post-username">{post.created_by_username}</p>
              <p class="feed-post-description">{post.description}</p>
            </div>
          </div>
          <img src={post.image_url} alt={post.title} class="feed-post-image" />
          <p class="feed-post-description-mobile">
            <span class="less">{post.created_by_username}: </span>
            {post.description}
          </p>
          <div class="feed-post-bottom">
            <div class="flex-between">
              <div class="feed-post-actions">
                <button class="feed-post-action" on:click={like}>
                  <HeartIcon iconClass="feed-action-icon heart-icon" />
                </button>
                <button class="feed-post-action" on:click={comments}>
                  <CommentIcon iconClass="feed-action-icon comment-icon" />
                </button>
                <button class="feed-post-action" on:click={share}>
                  <ShareIcon iconClass="feed-action-icon share-icon" />
                </button>
              </div>
              <div class="feed-post-actions">
                <button class="feed-post-action" on:click={report}>
                  <ReportIcon iconClass="feed-action-icon report-icon" />
                </button>
              </div>
            </div>
            <p class="reactions-count">
              {post.likes_count} likes <span class="reactions-dot">·</span>
              {post.comments_count} comments
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>
