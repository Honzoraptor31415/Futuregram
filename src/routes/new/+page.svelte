<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import RedFormStar from "$lib/components/RedFormStar.svelte";
  import { supabase } from "$lib/supabaseClient";
  import userDbData from "$lib/stores/user-db-data";
  import type { dbUserData } from "$lib/types/db";

  let title = "";
  let description = "";
  let titleLabel = "";
  let descriptionLabel = "";
  let photo: string | any;
  let photoFile: any;
  let files: any;
  let currDbUser: dbUserData;

  userDbData.subscribe((val: any) => {
    val && (currDbUser = val);
  });

  $: if (files) {
    console.log(files);
  }

  const onFileSelected = (e: any) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      photo = e.target!.result;
      console.log(e.target);
    };
  };

  loggedInUser.subscribe((val) => {
    val === null && browser && (location.href = "/signup");
  });

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

  function imageCheck() {
    // some logic, that I'll make later
    return true;
  }

  // async function uploadImage() {
  //   const { data, error } = await supabase.storage
  //     .from("post_images")
  //     .upload(`${title.trim().replaceAll(" ", "_")}.png`, photo, {
  //       cacheControl: "3600",
  //       upsert: false,
  //     });
  // }

  function newPost() {
    titleCheck();
    descriptionCheck();
    if (titleCheck() && descriptionCheck() && imageCheck()) {
      insertPost();
    }
  }

  async function insertPost() {
    if (currDbUser) {
      const { error } = await supabase.from("posts").insert({
        created_at: new Date().getTime(),
        // a random url, file upload will be coded later
        image_url:
          "https://gcmbwxvewajggyjepvpn.supabase.co/storage/v1/object/sign/post_images/example-image.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwb3N0X2ltYWdlcy9leGFtcGxlLWltYWdlLmpwZyIsImlhdCI6MTcxMDE1NDM2MywiZXhwIjoxNzQxNjkwMzYzfQ.RFett2JKNYfuPmv5EPYWlHbMKtSV-GeD8A7Vyx6iWeE&t=2024-03-11T10%3A52%3A43.648Z",
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
  class="new-post-main flex-center-all min-height-screen bottom-padding-nav"
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
              startClass="left-0"
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
              Title <RedFormStar startClass="left-0" />
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
