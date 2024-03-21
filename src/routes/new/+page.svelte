<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  loggedInUser.subscribe((val) => {
    browser && !val && (location.href = "/signup");
  });
</script>
