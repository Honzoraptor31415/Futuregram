<script lang="ts">
  export let startClass: string;
  export let text: string = "";
</script>

<span class="red form-star relative">
  *
  <p class={`form-star-description ${startClass}`}>
    {text === "" ? "This field" : text} is required
  </p>
</span>
