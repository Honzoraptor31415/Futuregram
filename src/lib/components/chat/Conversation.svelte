<script lang="ts">
  import type { RoomMember } from "$lib/types/db";

  export let active_users: string[];
  export let created_at: number;
  export let id: string;
  export let members: string[];
  export let room_members_info: RoomMember[];
</script>

<div class="current-chat terc-bg-element"></div>
