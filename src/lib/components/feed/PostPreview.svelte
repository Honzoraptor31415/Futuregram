<script lang="ts">
  export let imageUrl: string;
  export let linkHref: string;
  export let text: string = "View 👉";
</script>

<a href={linkHref} class="post-prew">
  <div class="post-prew-overlay-wrp">
    <img src={imageUrl} alt="Preview" class="prew-image" />
    <p class="post-prew-text">{text}</p>
  </div>
</a>
