<script lang="ts">
  import { getRandomHash } from "$lib/helper/random";

  export let checked: boolean;
  export let id = `checkbox-${getRandomHash(20)}`;
</script>

<div class="checkbox-wrapper-6">
  <input bind:checked class="tgl tgl-light" {id} type="checkbox" />
  <label class="tgl-btn" for={id}> </label>
</div>

<style>
  .checkbox-wrapper-6 .tgl {
    display: none;
  }
  .checkbox-wrapper-6 .tgl,
  .checkbox-wrapper-6 .tgl:after,
  .checkbox-wrapper-6 .tgl:before,
  .checkbox-wrapper-6 .tgl *,
  .checkbox-wrapper-6 .tgl *:after,
  .checkbox-wrapper-6 .tgl *:before,
  .checkbox-wrapper-6 .tgl + .tgl-btn {
    box-sizing: border-box;
  }
  .checkbox-wrapper-6 .tgl::-moz-selection,
  .checkbox-wrapper-6 .tgl:after::-moz-selection,
  .checkbox-wrapper-6 .tgl:before::-moz-selection,
  .checkbox-wrapper-6 .tgl *::-moz-selection,
  .checkbox-wrapper-6 .tgl *:after::-moz-selection,
  .checkbox-wrapper-6 .tgl *:before::-moz-selection,
  .checkbox-wrapper-6 .tgl + .tgl-btn::-moz-selection,
  .checkbox-wrapper-6 .tgl::selection,
  .checkbox-wrapper-6 .tgl:after::selection,
  .checkbox-wrapper-6 .tgl:before::selection,
  .checkbox-wrapper-6 .tgl *::selection,
  .checkbox-wrapper-6 .tgl *:after::selection,
  .checkbox-wrapper-6 .tgl *:before::selection,
  .checkbox-wrapper-6 .tgl + .tgl-btn::selection {
    background: none;
  }
  .checkbox-wrapper-6 .tgl + .tgl-btn {
    outline: 0;
    display: block;
    width: 3em;
    height: 1.7em;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .checkbox-wrapper-6 .tgl + .tgl-btn:after,
  .checkbox-wrapper-6 .tgl + .tgl-btn:before {
    position: relative;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
  }
  .checkbox-wrapper-6 .tgl + .tgl-btn:after {
    left: 0;
  }
  .checkbox-wrapper-6 .tgl + .tgl-btn:before {
    display: none;
  }
  .checkbox-wrapper-6 .tgl:checked + .tgl-btn:after {
    left: 50%;
  }

  .checkbox-wrapper-6 .tgl-light + .tgl-btn {
    background: #464646;
    border-radius: 2em;
    padding: 2px;
    transition: all 0.4s ease;
  }
  .checkbox-wrapper-6 .tgl-light + .tgl-btn:after {
    border-radius: 50%;
    background: #fff;
    transition: all 0.2s ease;
  }
  .checkbox-wrapper-6 .tgl-light:checked + .tgl-btn {
    background: var(--accent);
  }
</style>
