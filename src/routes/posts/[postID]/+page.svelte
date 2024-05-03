<script lang="ts">
  import Post from "$lib/components/Post.svelte";
  import TopPostNav from "$lib/components/TopPostNav.svelte";

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
      title={data.title}
      description={data.description}
      likes={data.likes}
      image_url={data.image_url}
      created_at={data.created_at}
    />
  </div>
  <div class="mobile-nav-placeholder"></div>
</main>
