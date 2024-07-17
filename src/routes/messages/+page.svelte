<script>
  import Conversation from "$lib/components/chat/Conversation.svelte";
</script>

<svelte:head>
  <title>Your chats</title>
</svelte:head>

<main class="chat-page-wrp">
  <div class="chat-page-grid min-height-screen desktop-nav-padding">
    <div class="chat-rooms terc-bg-element"></div>
    <Conversation
      id="123-skdjfaskdjfhlaksdhf"
      members={[]}
      active_users={[]}
      room_members_info={[]}
      created_at={new Date().getTime()}
    />
  </div>
</main>
