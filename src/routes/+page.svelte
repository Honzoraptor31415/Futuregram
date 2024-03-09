<script lang="ts">
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  export let data;

  let currentUser;

  console.log(data);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (user && browser) {
      // location.href = "/feed";
    } else if (browser) {
      // location.href = "/signup";
    }
    console.log(user);
  }
  getUser();
</script>
