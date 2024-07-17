<script lang="ts">
  import type { DbMessageReaction } from "$lib/types/db";

  export let id: string;
  export let createdAt: number;
  export let edited: boolean;
  export let imageUrls: string[] | null;
  export let reactions: DbMessageReaction[];
  export let roomId: string;
  export let text: string | null;
  export let type: string;
  export let user_id: string;
</script>
