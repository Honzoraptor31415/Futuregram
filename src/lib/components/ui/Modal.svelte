<script lang="ts">
  import { actionWarning } from "$lib/stores/app";
  import BackgroundWrp from "./BackgroundWrp.svelte";

  export let heading: string;
  export let text: string;
  export let func: () => void;
  export let continueBtnText: string = "Continue";
</script>

<BackgroundWrp
  hideFunc={() => {
    actionWarning.set(null);
  }}
>
  <div class="sec-bg-element flex-column align-center gap-10 action-warning">
    <h2 class="action-warning-m-inline">{heading}</h2>
    <p class="less action-warning-m-inline">{text}</p>
    <div class="w-full grid-col-half">
      <button
        class="no-style action-warning-button less pointer"
        on:click={() => {
          actionWarning.set(null);
        }}>Cancel</button
      >
      <button
        class="no-style action-warning-button pointer"
        on:click={() => {
          func();
          actionWarning.set(null);
        }}><b class="red">{continueBtnText}</b></button
      >
    </div>
  </div>
</BackgroundWrp>
