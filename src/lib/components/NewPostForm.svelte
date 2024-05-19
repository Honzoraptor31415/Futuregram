<script lang="ts">
  import userDbData from "$lib/stores/userDbData";
  import type { DBUserData } from "$lib/types/db";
  import type { StorageResponse } from "$lib/types/storage";
  import * as validation from "$lib/helper/formValidation";
  import type { AuthUser } from "$lib/types/auth.js";
  import loggedInUser from "$lib/stores/user.js";
  import { supabase } from "$lib/supabaseClient.js";
  import { browser } from "$app/environment";
  import FormElement from "$lib/components/FormElement.svelte";
  import ThreeDotsHoriz from "$lib/components/icons/ThreeDotsHoriz.svelte";
  import HiddenMenu from "$lib/components/HiddenMenu.svelte";
  import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import SaveIcon from "$lib/components/icons/SaveIcon.svelte";
  import NewPostField from "$lib/components/NewPostField.svelte";

  let title = "";
  let description = "";
  let titleLabel = "";
  let descriptionLabel = "";
  let photo: string | any;
  let photoFile: any;
  let files: any;
  let currDbUser: DBUserData;
  let image: any;
  let currUser: AuthUser;
  let images: any[] = [];

  userDbData.subscribe((val: any) => {
    val && (currDbUser = val);
  });

  loggedInUser.subscribe((val: any) => {
    val && (currUser = val);
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
        }
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

    titleLabel = validation.titleCheck(title);
    descriptionLabel = validation.descriptionCheck(description);
    if (
      descriptionLabel === "" &&
      titleLabel === "" &&
      validation.imageCheck() === ""
    ) {
      uploadImage().then((data) => {
        if (data) {
          insertPost(data.imageURL);
        }
      });
    }
  }

  async function insertPost(imgURL: string) {
    if (currDbUser && currUser) {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          created_at: new Date().getTime(),
          image_url: imgURL,
          user_id: currDbUser.id,
          description: description,
          title: title,
        })
        .select()
        .single();
      if (data && !error && browser) {
        location.href = `/posts/${data.id}`;
      }
    } else {
      console.error("Error while uploading: user ain't logged in.");
    }
  }
</script>

<svelte:head>
  <title>Create a post on Futuregram</title>
</svelte:head>

<div class="feed-page-post-wrp">
  {#if currDbUser}
    <div class="post">
      <div class="post-left">
        <a href={`/${currDbUser.url_username}`} class="grid-wrp"
          ><img
            src={currDbUser.image_url}
            alt={currDbUser.url_username}
            class="post-user-image image-height-40 rounded margin-top-4"
          /></a
        >
      </div>
      <div class="post-right grid-wrp">
        <div class="post-top mobile">
          <a href={`/${currDbUser.url_username}`} class="grid-wrp"
            ><img
              src={currDbUser.image_url}
              alt={currDbUser.url_username}
              class="post-user-image image-height-40 rounded margin-top-4"
            /></a
          >
          <div class="post-texts flex-between">
            <a
              href={`/${currDbUser.url_username}`}
              class="post-username align-center">{currDbUser.url_username}</a
            >
            <div class="align-center">
              <HiddenMenu
                btnClass="no-style flex-center-all button-element before-hover-anim comments-menu"
                icon={ThreeDotsHoriz}
                iconClass="small-post-icon"
                btnDisabled
              />
            </div>
          </div>
        </div>
        <div class="post-top desktop">
          <div class="post-texts">
            <div class="post-texts-top flex-between">
              <a
                href={`/${currDbUser.url_username}`}
                class="post-username align-center">{currDbUser.url_username}</a
              >
              <div class="align-center">
                <HiddenMenu
                  btnClass="no-style flex-center-all button-element before-hover-anim comments-menu"
                  icon={ThreeDotsHoriz}
                  iconClass="small-post-icon"
                  btnDisabled
                />
              </div>
            </div>
            <NewPostField
              onChange={(e) => onFileSelected(e)}
              bind:value={description}
            />
          </div>
        </div>
        <NewPostField
          onChange={(e) => onFileSelected(e)}
          wrpClass="mobile"
          bind:value={description}
        />
        <div class="post-bottom">
          <div class="flex-between">
            <div class="post-actions gap-15">
              <button
                disabled
                class="post-action before-hover-anim rounded gap-3 align-center bha-keep-scale"
              >
                <HeartIcon iconClass="action-icon heart-icon" />
              </button>
              <button
                disabled
                class="post-action before-hover-anim bha-keep-scale align-center gap-3 rounded button-link font-weight-normal"
              >
                <CommentIcon iconClass="action-icon comment-icon" />
              </button>
              <button
                disabled
                class="post-action before-hover-anim bha-keep-scale rounded"
              >
                <ShareIcon iconClass="action-icon share-icon" />
              </button>
            </div>
            <div class="post-actions">
              <button
                disabled
                class="post-action before-hover-anim bha-keep-scale rounded"
              >
                <SaveIcon iconClass="action-icon save-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
