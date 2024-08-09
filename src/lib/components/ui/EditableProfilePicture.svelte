<script lang="ts">
  import userDbData from "$lib/stores/userDbData";
  import type { DbUser } from "$lib/types/db";
  import Cropper from "svelte-easy-crop";
  import EditIcon from "../icons/EditIcon.svelte";
  import BackgroundWrp from "./BackgroundWrp.svelte";
  import { primaryButton } from "$lib/constants/classes";

  export let wrpClass = "grid-wrp";

  let currUserDbData: DbUser;
  let files: FileList;
  let isReaderLoading = false;
  let image: any;
  let isCropperShown = false;
  let pixelCrop: any;

  userDbData.subscribe((val: any) => {
    currUserDbData = val;
  });

  function onChange(e: any) {
    if (isReaderLoading) return;

    isReaderLoading = true;

    for (let i = 0; i < e.target.files.length; i++) {
      image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        image = e.target!.result;
        isCropperShown = true;
      };
    }

    isReaderLoading = false;
  }

  function cancelEditing() {
    isCropperShown = false;
    image = null;
    const inputElement = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    inputElement.files = null;
    isReaderLoading = false;
  }

  function cropComplete(e: any) {
    pixelCrop = e.detail.pixels;
  }

  $: console.log(files, image);
</script>

{#if isCropperShown && image}
  <BackgroundWrp hideFunc={cancelEditing}>
    <div class="sec-bg-element flex-column gap-10 cropper-card">
      <div class="grid-wrp relative pfp-cropper-wrp">
        <Cropper
          {image}
          aspect={1}
          zoom={1}
          crop={{ x: 0, y: 0 }}
          on:cropcomplete={cropComplete}
        />
      </div>
      <button class={primaryButton}>Save</button>
    </div>
  </BackgroundWrp>
{/if}
<div class="editable-profile-image-wrp {wrpClass}">
  <div class="max-w-fit relative">
    <img
      src={currUserDbData.image_url}
      alt="Profile"
      class="rounded settings-user-image"
    />
    <div class="absolute sec-bg-button profile-picture-edit-button">
      <label
        for="image-input"
        class="before-hover-anim pointer max-w-fit rounded grid-wrp padding-12"
      >
        <EditIcon iconClass="image-height-15" />
        <input
          type="file"
          on:change={onChange}
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          bind:files
          id="image-input"
        />
      </label>
    </div>
  </div>
</div>
