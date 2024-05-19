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
  import { getRandomHash } from "$lib/helper/random";
  import setNotification from "$lib/helper/appNotifications";

  let description = "";
  let descriptionLabel = "";
  let photoFile: any;
  let files: any;
  let currDbUser: DBUserData;
  let image: any;
  let currUser: AuthUser;
  let images: any[] = [];
  let readerLoading = false;

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
    if (readerLoading) return;

    readerLoading = true;

    for (let i = 0; i < e.target.files.length; i++) {
      image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        images.push(e.target!.result);
        console.log(e.target);

        let imageCheck = validation.imageCheck(
          images[i],
          files[i].type,
          files[i].size < 1000
            ? files[i].size
            : Math.round(files[i].size / 1000)
        );

        if (!imageCheck.isValid) {
          setNotification(imageCheck.message);
        }
        console.log("READER loaded and everything in it ran");
      };
    }

    readerLoading = false;
  };

  async function uploadImages() {
    let urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      let imageCheck = validation.imageCheck(
        images[i],
        files[i].type,
        files[i].size < 1000 ? files[i].size : Math.round(files[i].size / 1000)
      );
      console.log(imageCheck);
      if (imageCheck.isValid) {
        const { imageUrl } = await uploadImage(
          files[i],
          images[i].name,
          images[i].type
        );
        urls = [...urls, imageUrl];

        if (i === files.length - 1) {
          return {
            imageUrls: urls,
          };
        }
      }
    }
  }

  async function uploadImage(imageData: any, name: any, type: string) {
    const uploadImageResponse: StorageResponse = await supabase.storage
      .from("post_images")
      .upload(
        `${new Date().getTime()}-${getRandomHash(10)}-${name}`,
        imageData,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: type,
        }
      );

    if (uploadImageResponse.data.path) {
      const getImageURLResponse = supabase.storage
        .from("post_images")
        .getPublicUrl(uploadImageResponse.data.path);

      console.log(getImageURLResponse.data.publicUrl);
      return {
        imageUrl: getImageURLResponse.data.publicUrl,
      };
    } else {
      return {
        imageUrl: "",
      };
    }
  }

  function newPost() {
    description = description.trim();

    descriptionLabel = validation.descriptionCheck(description);

    if (images.length < 1) {
      if (descriptionLabel === "") {
        insertPost();
      }
    } else {
      if (descriptionLabel === "") {
        uploadImages().then((data) => {
          if (data) {
            insertPost(data.imageUrls);
          }
        });
      }
    }
  }

  async function insertPost(imgUrls?: string[]) {
    if (currDbUser && currUser) {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          created_at: new Date().getTime(),
          image_urls: imgUrls ?? [],
          user_id: currDbUser.id,
          description: description,
        })
        .select()
        .single();
      console.log(data, error);
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
          </div>
        </div>
        <NewPostField
          submit={newPost}
          bind:files
          bind:photoFile
          onChange={(e) => onFileSelected(e)}
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
