<script lang="ts">
  import Post from "$lib/components/feed/Post.svelte";
  import TopPostNav from "$lib/components/feed/TopPostNav.svelte";
  import { page } from "$app/stores";

  export let data;

  let commentActive = false;

  page.subscribe((val: any) => {
    commentActive = val.url.search === "?comment";
  });
</script>

<svelte:head>
  <title>{`${data.description?.slice(0, 19)}... - Futuregram`}</title>
</svelte:head>

<main class="feed-main desktop-nav-margin">
  <TopPostNav />
  <div class="posts-inline-spacing">
    <Post
      user_id={data.user_id}
      id={data.id}
      description={data.description}
      likes={data.likes}
      image_urls={data.image_urls}
      created_at={data.created_at}
      {commentActive}
    />
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
