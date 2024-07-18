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

  let currLoggedInUser: AuthUser;
  let currUserDbData: DbUser;
  let email = "";
  let emailLabel = "";
  let bio = "";
  let bioLabel = "";
  let username = "";
  let usernameLabel = "";
  let displayedName = "";
  let displayedNameLabel = "";

  userDbData.subscribe((val: any) => {
    console.log(val);
    if (val) {
      currUserDbData = val;
      username = val.url_username;
      displayedName = val.displayed_username;
      bio = val.bio;
    }
  });

  async function editProfile(colName: string) {
    if (currUserDbData) {
      // unfortunately a switch case is not useful here
      if (colName === "username") {
        const { error } = await supabase
          .from("users")
          .update({
            url_username: username,
          })
          .eq("id", currUserDbData.id);
        error
          ? setNotification({ text: "Something went wrong" })
          : setNotification({ text: "Username updated!" });
      } else if (colName === "displayedName") {
        const { error } = await supabase.from("users").update({
          displayed_username: displayedName,
        });
        error
          ? setNotification({ text: "Something went wrong" })
          : setNotification({ text: "Displayed name updated!" });
      } else if (colName === "bio") {
        const { error } = await supabase.from("users").update({
          bio: bio,
        });
        error
          ? setNotification({ text: "Something went wrong" })
          : setNotification({ text: "Bio updated!" });
      }
    }
  }
</script>

<svelte:head>
  <title>Your settings</title>
</svelte:head>

{#if currUserDbData}
  <div class="desktop-nav-padding settings-main-wrp">
    <main class="settings-main sec-bg-element gap-20">
      <h2>Settings</h2>
      <div class="settings-content">
        <section class="settings-section gap-20 flex-column" id="profile">
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
                  editProfile("username");
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
                  bind:value={username}
                  isValid={usernameLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={username === currUserDbData.url_username}
                  >Save</button
                >
              </form>
              <form
                on:submit={() => {
                  editProfile("displayedName");
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
                  bind:value={displayedName}
                  isValid={displayedNameLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={displayedName === currUserDbData.displayed_username}
                  >Save</button
                >
              </form>
              <form
                on:submit={() => {
                  editProfile("bio");
                }}
                class="flex-between align-end gap-10 settings-form"
              >
                <FormElement
                  id="bio"
                  initLabel="Bio"
                  placeholder="Your bio"
                  label={bioLabel}
                  bind:value={bio}
                  wrpClass="w-full"
                  type="textarea"
                  isValid={bioLabel === ""}
                />
                <button
                  class="user-input button-element primary-button settings-input-height"
                  type="submit"
                  disabled={bio === currUserDbData.bio}>Save</button
                >
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
{/if}
