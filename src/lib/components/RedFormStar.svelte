<script lang="ts">
  export let starClass: string;
  export let text: string = "";
</script>

<span class="red form-star relative">
  *
  <p class={`form-star-description ${starClass}`}>
    {text === "" ? "This field" : text} is required
  </p>
</span>
