<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/ui/Error.svelte";
</script>

<Error code={$page.status} message={$page.error?.message} />
