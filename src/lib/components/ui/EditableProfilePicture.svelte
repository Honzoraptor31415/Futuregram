<script lang="ts">
  import userDbData from "$lib/stores/userDbData";
  import type { DbUser } from "$lib/types/db";
  import Cropper from "svelte-easy-crop";
  import EditIcon from "../icons/EditIcon.svelte";
  import BackgroundWrp from "./BackgroundWrp.svelte";
  import { primaryButton } from "$lib/constants/classes";
  import { getCroppedImg } from "$lib/helper/imageCropperUtils";
  import { profilePictureCheck } from "$lib/helper/formValidation";
  import { setNotification } from "$lib/helper/appNotifications";
  import type { StorageResponse } from "$lib/types/storage";
  import { supabase } from "$lib/supabaseClient";
  import { getRandomHash } from "$lib/helper/random";

  export let wrpClass = "grid-wrp";

  let currUserDbData: DbUser;
  let files: FileList;
  let isReaderLoading = false;
  let image: any;
  let isCropperShown = false;
  let pixelCrop: any;
  let croppedImageUrl: any;

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

  async function cropImage() {
    croppedImageUrl = await getCroppedImg(image, pixelCrop);

    if (croppedImageUrl) {
      isCropperShown = false;
      uploadProfilePicture();
    }
  }

  async function uploadProfilePicture() {
    const checkerImage = new Image();
    checkerImage.src = croppedImageUrl;

    let croppedImageData = await fetch(croppedImageUrl).then((r) => r.blob());
    console.log(croppedImageData);

    console.log(checkerImage);

    console.log("Checker image loaded");
    let reader = new FileReader();
    reader.readAsDataURL(croppedImageData);
    reader.onload = (e) => {
      image = e.target!.result;
      console.log("Reader loaded", e, image);
    };

    const imageCheck = profilePictureCheck(
      croppedImageData.type,
      croppedImageData.size,
      checkerImage.width,
      checkerImage.height
    );

    if (!imageCheck.isValid) {
      setNotification({ text: imageCheck.message });
      isCropperShown = false;
      image = null;
      return;
    }

    const uploadImageResponse: StorageResponse = await supabase.storage
      .from("profile_images")
      .upload(
        `${new Date().getTime()}-${getRandomHash(10)}-${currUserDbData.url_username}.${croppedImageData.type.split("/")[1]}`,
        croppedImageData,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        }
      );

    console.log(uploadImageResponse);

    if (uploadImageResponse.data.path) {
      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(uploadImageResponse.data.path);

      if (!data) {
        setNotification({ text: "Something went worng when uploading file" });
        return;
      } else if (data && currUserDbData) {
        const { error } = await supabase
          .from("users")
          .update({
            image_url: data.publicUrl,
          })
          .eq("id", currUserDbData.id);
        error
          ? setNotification({
              text: "Something went wrong when updating your profile",
            })
          : setNotification({ text: "Profile picture updated!" });
      }
    }
  }
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
      <button class={primaryButton} on:click={cropImage}>Save</button>
    </div>
  </BackgroundWrp>
{/if}
<div class="editable-profile-image-wrp {wrpClass}">
  <div class="max-w-fit relative">
    <img
      src={croppedImageUrl ?? currUserDbData.image_url}
      alt="Profile"
      class="rounded settings-user-image"
    />
    <div class="absolute sec-bg-button profile-picture-edit-button">
      <label
        for="image-input"
        class="before-hover-anim pointer max-w-fit rounded grid-wrp padding-12 btn-active-opacity"
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
