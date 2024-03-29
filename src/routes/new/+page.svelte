<script lang="ts">
  import { browser } from "$app/environment";
  import loggedInUser from "$lib/stores/user";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";

  let title = "";
  let description = "";
  let titleLabel = "";
  let descriptionLabel = "";
  let files: any;

  $: if (files) {
    console.log(files);
  }

  loggedInUser.subscribe((val) => {
    val === null && browser && (location.href = "/signup");
  });

  function newPost() {
    console.log("New post function");
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
      <div class="new-post-form-side">
        <p class="label mobile">Add a photo</p>
        <label for="photo" class="new-post-photo-button flex-center-all">
          <PlusIcon iconClass="image-height-40 new-post-button-icon" />
        </label>
        <input
          type="file"
          id="photo"
          class="hidden"
          accept="image/jpeg,image/png,image/webp"
          bind:files
        />
      </div>
      <div class="new-post-form-side flex-between">
        <div class="form-element">
          <label
            for="title"
            class={`no-tp ${titleLabel !== "" ? "form-error" : ""}`}
            >{titleLabel === "" ? "Title" : titleLabel}</label
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
