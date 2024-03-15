<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { browser } from "$app/environment";

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    !user && browser && (location.href = "/login");
  }
  getUser();
</script>
