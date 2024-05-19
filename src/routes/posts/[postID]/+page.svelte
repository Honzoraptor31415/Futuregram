<script lang="ts">
  import Post from "$lib/components/Post.svelte";
  import TopPostNav from "$lib/components/TopPostNav.svelte";
  import { page } from "$app/stores";

  let commentActive = false;

  page.subscribe((val: any) => {
    commentActive = val.url.search === "?comment";
  });

  export let data;
</script>

<svelte:head>
  <title>{data ? `${data.title} - Futuregram` : "Loading post..."}</title>
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
