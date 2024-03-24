<script lang="ts">
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";

  function historyStep(step: string) {
    switch (step) {
      case "back":
        history.back();
        break;

      default:
        console.log("Invalid step");
        break;
    }
  }
</script>

<nav class="mobile-top-nav">
  <button
    on:click={() => {
      historyStep("back");
    }}
    class="grid-wrp no-style mobile-top-btn btn-active-opacity"
  >
    <ArrowLeftIcon iconClass="mobile-top-nav-icon" />
  </button>
</nav>
