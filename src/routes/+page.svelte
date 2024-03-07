<script>
  import { browser } from "$app/environment";
  import { supabase } from "$lib/supabaseClient";
  export let data;
  console.log(data.posts);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (user && browser) {
      location.href = "/feed";
    } else if (browser) {
      location.href = "/login";
    }
  }
  getUser();
</script>

<h1>Futuregram</h1>
