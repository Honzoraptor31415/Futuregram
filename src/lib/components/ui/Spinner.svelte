<script>
  export let size = 48;
  export let color = "#fff";
  export let borderWidth = 3;
</script>

<span
  class="loader"
  style="--size:{size}px;--color:{color};--border-width:{borderWidth}px"
></span>

<style>
  .loader {
    width: var(--size);
    height: var(--size);
    border: var(--border-width) solid var(--color);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
