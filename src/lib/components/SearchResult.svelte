<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  export let id: string;
  console.log(id);

  function follow() {
    console.log("Follow function");
  }
</script>

<a href="/honzoraptor" class="search-result">
  <div class="result-left">
    <img
      src={`https://xsgames.co/randomusers/assets/avatars/pixel/${Math.floor(Math.random() * 53)}.jpg`}
      alt="Result"
      class="result-user-image radius-50 image-height-40"
    />
  </div>
  <div class="result-right flex-between">
    <div class="result-info">
      <p class="result-displayed-username feed-post-username">Example user</p>
      <p class="result-url-username less font-weight-normal">example.user</p>
    </div>
    <div class="result-right-button">
      <button
        class="button-element secondary-button user-page-input font-weight search-follow"
        on:click={(e) => {
          e.preventDefault();
          follow();
        }}>Follow</button
      >
    </div>
  </div>
</a>
