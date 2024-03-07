<script lang="ts">
  export let code: Number;
  export let message: string | undefined;
</script>

<svelte:head>
  <title>Error {code}</title>
</svelte:head>

<header class="flex-center-all">
  <div class="error-wrp">
    <h2>Error {code}</h2>
    <p>{message}</p>
  </div>
</header>
