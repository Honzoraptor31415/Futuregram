<script lang="ts">
  import { getRandomHash } from "$lib/helper/random";
  import { onMount } from "svelte";

  export let linkHref = "";
  export let disappearing: boolean;
  export let text: string;
  export let linkText = "View";

  const id = `notification-${getRandomHash(10)}`;
  const touch = {
    isDown: false,
    x: 0,
    startPosX: 0,
  };

  let notificationElement: any;

  function touchStartHandler(e: any) {
    console.log(touch);

    touch.isDown = true;
    touch.x = e.clientX;
    touch.startPosX = e.clientX;
  }

  function touchEndHandler(e: any) {
    touch.isDown = false;
    touch.x = 0;
    touch.startPosX = 0;
  }

  function touchMoveHandler(e: any) {
    if (touch.isDown) {
      touch.x = e.clientX;
      console.log(touch);
    }
  }

  onMount(() => {
    notificationElement = document.getElementById(id);

    document.addEventListener("mouseup", touchEndHandler);
    document.addEventListener("touchend", touchEndHandler);
    document.addEventListener("touchmove", touchMoveHandler);
    document.addEventListener("mousemove", touchMoveHandler);

    return () => {
      document.removeEventListener("mouseup", touchEndHandler);
      document.removeEventListener("touchend", touchEndHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
      document.removeEventListener("mousemove", touchMoveHandler);
    };
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:touchstart={touchStartHandler}
  on:mousedown={touchStartHandler}
  {id}
  class="app-notification {linkHref ? 'flex-between' : ''} {disappearing
    ? 'app-notification-hide'
    : ''}"
  style="transform: translateX(calc(-50% + {-1 *
    (touch.startPosX - touch.x)}px))"
>
  <p class="no-select">{text}</p>
  {#if linkHref}
    <a class="hover-underline weight-500" href={linkHref}>{linkText}</a>
  {/if}
</div>
