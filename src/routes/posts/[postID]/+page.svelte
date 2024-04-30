<script lang="ts">
  import type { DBPost } from "$lib/types/db";
  import Post from "$lib/components/Post.svelte";
  import TopPostNav from "$lib/components/TopPostNav.svelte";

  export let data;

  const supabase = data.supabase;
  let postID = data.postID;

  let post: DBPost;

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
</script>

<svelte:head>
  <title>{post ? `"${post.title}" - Futuregram` : "Loading post..."}</title>
</svelte:head>

<main class="feed-main desktop-nav-margin">
  <TopPostNav />
  <div class="feed-posts-wrp">
    <Post {supabase} {postID} />
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
