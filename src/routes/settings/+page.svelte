<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import { browser } from "$app/environment";
  import type { AuthUser } from "$lib/types/auth";
  import type { DbUser } from "$lib/types/db";
  import RedFormStar from "$lib/components/forms/RedFormStar.svelte";
  import FormElement from "$lib/components/forms/FormElement.svelte";
  import * as validation from "$lib/helper/formValidation";
  import { setNotification } from "$lib/helper/appNotifications";

  let currUserDbData: DbUser;
  let bioLabel = "";
  let usernameLabel = "";
  let displayedNameLabel = "";

  let profileForm = {
    url_username: "",
    displayed_username: "",
    bio: "",
  };

  userDbData.subscribe((val: any) => {
    console.log(val);
    if (val) {
      currUserDbData = val;
      profileForm.url_username = val.url_username;
      profileForm.displayed_username = val.displayed_username;
      profileForm.bio = val.bio;
    }
  });

  async function editProfile() {
    if (currUserDbData) {
      usernameLabel = (await validation.usernameCheck(profileForm.url_username))
        .message;
      displayedNameLabel = validation.displayedNameCheck(
        profileForm.displayed_username
      ).message;
      bioLabel = validation.bioCheck(profileForm.bio).message;

      if (
        (await validation.usernameCheck(profileForm.url_username)).isValid &&
        validation.displayedNameCheck(profileForm.displayed_username).isValid &&
        validation.bioCheck(profileForm.bio).isValid
      ) {
        const { error } = await supabase
          .from("users")
          .update(profileForm)
          .eq("id", currUserDbData.id);

        if (error) {
          console.log(error);
          setNotification({ text: "Something went wrong" });
        } else {
          const { data } = await supabase
            .from("users")
            .select()
            .eq("id", currUserDbData.id)
            .single();
          data && userDbData.set(data);
          setNotification({ text: "Profile updated!" });
        }
      }
    }
  }
</script>

<svelte:head>
  <title>Your settings</title>
</svelte:head>

{#if currUserDbData}
  <div class="desktop-nav-padding settings-main-wrp">
    <main class="settings-main">
      <div class="settings-content">
        <section
          class="sec-bg-element settings-section gap-20 flex-column"
          id="profile"
        >
          <h3 class="settings-section-heading">Profile settings</h3>
          <div class="settings-grid">
            <div class="grid-wrp">
              <img
                src={currUserDbData.image_url}
                alt="Profile"
                class="rounded settings-user-image"
              />
            </div>
            <div class="gap-10 flex-column">
              <form
                on:submit={() => {
                  editProfile();
                }}
                class="flex-between align-end gap-10 settings-form"
              >
                <FormElement
                  id="username"
                  labelClass="no-tp"
                  initLabel="Username"
                  placeholder="Username"
                  inputClass="settings-input-height"
                  label={usernameLabel}
                  bind:value={profileForm.url_username}
                  isValid={usernameLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={profileForm.url_username ===
                    currUserDbData.url_username}>Save</button
                >
              </form>
              <form
                on:submit={() => {
                  editProfile();
                }}
                class="flex-between align-end gap-10 settings-form"
              >
                <FormElement
                  id="displayed-name"
                  labelClass="no-tp"
                  initLabel="Displayed username"
                  inputClass="settings-input-height"
                  placeholder="Displayed name"
                  label={displayedNameLabel}
                  bind:value={profileForm.displayed_username}
                  isValid={displayedNameLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={profileForm.displayed_username ===
                    currUserDbData.displayed_username}>Save</button
                >
              </form>
              <form
                on:submit={() => {
                  editProfile();
                }}
                class="flex-between align-end gap-10 settings-form"
              >
                <FormElement
                  id="bio"
                  initLabel="Bio"
                  placeholder="Your bio"
                  label={bioLabel}
                  bind:value={profileForm.bio}
                  wrpClass="w-full"
                  type="textarea"
                  isValid={bioLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={profileForm.bio === currUserDbData.bio}>Save</button
                >
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
{/if}
