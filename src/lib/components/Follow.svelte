<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { AuthUser } from "$lib/types/auth";
  import type { DBUserData } from "$lib/types/db";
  export let uid: string;
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/user-db-data";
  export let btnClass: string;
  export let unfollowText: string = "Unfollow";
  export let followText: string = "Follow";
  export let unfollowClass: string = "less";

  let user: DBUserData;
  let currDbUser: DBUserData;
  let currLoggedInUser: AuthUser;
  let followed = false;

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
  });

  userDbData.subscribe((val: any) => {
    currDbUser = val;
    val && getFollowed(val.id);
  });

  async function getFollowed(funcUid: string) {
    const { data, error } = await supabase.from("users").select().eq("id", uid);
    if (data && data[0].followers && data[0].followers.includes(funcUid)) {
      followed = true;
      console.log("User is followed");
    } else {
      console.log("You don't follow this user");
    }
  }

  async function getUser() {
    const { data } = await supabase.from("users").select().eq("id", uid);

    data && (user = data[0]);
  }
  getUser();

  async function follow() {
    if (currLoggedInUser) {
      followed = !followed;
      let followers = [];
      let currUserFollows = [];
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);
      const res = await supabase.from("users").select().eq("id", currDbUser.id);
      res.data &&
        res.data[0].follows &&
        (currUserFollows = res.data[0].follows);
      data && data[0].followers && (followers = data[0].followers);
      if (followers && !followers.includes(currDbUser.id)) {
        followers.push(currDbUser.id);
        currUserFollows.push(user.id);
        user.followers = followers;
        updateFollowers(followers, user.id);
        updateFollows(currUserFollows, currDbUser.id);
      } else {
        followers &&
          (followers = followers.filter((user: string) => {
            return user !== currDbUser.id;
          }));
        currUserFollows &&
          (currUserFollows = currUserFollows.filter((uid: string) => {
            return uid !== user.id;
          }));
        user.followers = followers;
        updateFollowers(followers, user.id);
        updateFollows(currUserFollows, currDbUser.id);
      }
    } else {
      console.log("You have to be logged in to follow users.");
    }
  }

  async function updateFollows(value: string[], uid: string) {
    const { error } = await supabase
      .from("users")
      .update({ follows: value })
      .eq("id", uid);
    console.log(error);
  }

  async function updateFollowers(value: string[], uid: string) {
    const { error } = await supabase
      .from("users")
      .update({ followers: value })
      .eq("id", uid);
    console.log(error);
  }
</script>

{#if user}
  {#if user.id !== currDbUser.id}
    <button
      class={`${btnClass} ${followed ? unfollowClass : ""}`}
      on:click={(e) => {
        e.preventDefault();
        follow();
      }}>{followed ? unfollowText : followText}</button
    >
  {/if}
{:else}
  <a href="/login" class={btnClass}>{followText}</a>
{/if}
