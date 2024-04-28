<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import RedFormStar from "$lib/components/RedFormStar.svelte";
  import { supabase } from "$lib/supabaseClient";
  import userDbData from "$lib/stores/user-db-data";
  import type { DBUserData } from "$lib/types/db";
  import { imageCheck } from "$lib/helper/form-validation";
  import type { StorageResponse } from "$lib/types/storage";

  let title = "";
  let description = "";
  let titleLabel = "";
  let descriptionLabel = "";
  let photo: string | any;
  let photoFile: any;
  let files: any;
  let currDbUser: DBUserData;
  let image: any;

  userDbData.subscribe((val: any) => {
    val && (currDbUser = val);
  });

  $: if (files) {
    console.log(files);
  }

  const onFileSelected = (e: any) => {
    image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      photo = e.target!.result;
      console.log(e.target);
    };
  };

  function titleCheck() {
    title = title.trim();
    if (title.length < 1) {
      titleLabel = "Title can't be empty";
      return false;
    } else if (title.length < 2) {
      titleLabel = "Title is too short";
      return false;
    } else {
      titleLabel = "";
      return true;
    }
  }

  function descriptionCheck() {
    if (description.length > 500) {
      descriptionLabel = "Description is too long";
      return false;
    } else {
      descriptionLabel = "";
      return true;
    }
  }

  async function uploadImage() {
    const uploadImageResponse: StorageResponse = await supabase.storage
      .from("post_images")
      .upload(
        `${title.trim().replaceAll(" ", "-") + new Date().getTime()}-.png`,
        image,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: files[0].type,
        },
      );

    if (uploadImageResponse.data.path) {
      const getImageURLResponse = supabase.storage
        .from("post_images")
        .getPublicUrl(uploadImageResponse.data.path);

      console.log(getImageURLResponse.data.publicUrl);
      return {
        imageURL: getImageURLResponse.data.publicUrl,
      };
    }
  }

  function newPost() {
    title = title.trim();
    description = description.trim();
    titleCheck();
    descriptionCheck();
    if (titleCheck() && descriptionCheck() && imageCheck()) {
      uploadImage().then((data) => {
        if (data) {
          insertPost(data.imageURL);
        }
      });
    }
  }

  async function insertPost(imgURL: string) {
    if (currDbUser) {
      const { error } = await supabase.from("posts").insert({
        created_at: new Date().getTime(),
        image_url: imgURL,
        user_id: currDbUser.id,
        description: description,
        title: title,
      });
      console.log(error);
    } else {
      console.error("Error while uploading: user ain't logged in.");
    }
  }
</script>

<svelte:head>
  <title>Create a post on Futuregram</title>
</svelte:head>

<main
  class="new-post-main flex-center-all min-height-screen bottom-padding-nav desktop-nav-margin"
>
  <form class="form sec-bg-element grid-wrp new-post-form" on:submit={newPost}>
    <h2 class="inline-auto">Create a new post</h2>
    <div class="form-content form">
      <div class="new-post-form-side gap-0 new-post-photos-side">
        {#if photo}
          <div class="grid-wrp new-post-photos-grid">
            <div class="grid-wrp new-post-photo-wrp">
              <img src={photo} alt={title} class="new-post-photo radius-main" />
            </div>
          </div>
        {:else}
          <label for="photo" class="label no-tp"
            >Add one or more photos <RedFormStar
              text="A photo"
              starClass="left-0"
            /></label
          >
          <label for="photo" class="new-post-photo-button flex-center-all">
            <PlusIcon iconClass="image-height-40 new-post-button-icon" />
          </label>
          <input
            type="file"
            id="photo"
            class="hidden"
            accept="image/jpeg,image/png,image/webp"
            on:change={(e) => onFileSelected(e)}
            bind:this={photoFile}
            bind:files
            multiple
          />
        {/if}
      </div>
      <div class="new-post-form-side justify-center">
        <div class="form-element">
          <label
            for="title"
            class={`no-tp ${titleLabel !== "" ? "form-error" : ""}`}
            >{#if titleLabel === ""}
              Title <RedFormStar starClass="left-0" />
            {:else}
              {titleLabel}
            {/if}</label
          >
          <input
            type="text"
            id="title"
            bind:value={title}
            class={`user-input user-input-text ${titleLabel !== "" ? "form-error-input" : ""}`}
            placeholder="Title"
          />
        </div>
        <div class="form-element">
          <label
            for="post-description"
            class={descriptionLabel !== "" ? "form-error" : ""}
            >{descriptionLabel === "" ? "Description" : descriptionLabel}</label
          >
          <textarea
            bind:value={description}
            id="post-description"
            placeholder="Describe your post"
            class={`user-input user-input-text ${descriptionLabel !== "" ? "form-error-input" : ""}`}
          ></textarea>
        </div>
        <button type="submit" class="user-input button-element primary-button"
          >Create post!</button
        >
      </div>
    </div>
  </form>
</main>
