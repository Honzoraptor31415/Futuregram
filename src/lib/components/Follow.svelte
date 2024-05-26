<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import type { AuthUser } from "$lib/types/auth";
  import type { DbUser } from "$lib/types/db";
  import loggedInUser from "$lib/stores/user";
  import userDbData from "$lib/stores/userDbData";
  import { onMount } from "svelte";

  export let uid: string;
  export let btnClass: string;
  export let unfollowText: string = "Unfollow";
  export let followText: string = "Follow";
  export let unfollowClass: string = "less";
  export let strictClasses = false;
  export let followersAsUsers: DbUser[] = [];
  export let showEditingButtonWhenCurrUser = false;

  let user: DbUser;
  let currDbUser: DbUser;
  let currLoggedInUser: AuthUser;
  let followed = false;

  loggedInUser.subscribe((val: any) => {
    currLoggedInUser = val;
  });

  userDbData.subscribe((val: any) => {
    if (val) {
      currDbUser = val;
      getFollowed(val.id);
    }
  });

  async function getFollowed(funcUid: string) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", uid)
      .single();
    if (data && data.followers && data.followers.includes(funcUid)) {
      followed = true;
    }
  }

  async function getUser() {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", uid)
      .single();

    data && (user = data);
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
        updateExportedFollowersById(followers);
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
        updateExportedFollowersById(followers);
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
  }

  async function updateFollowers(value: string[], uid: string) {
    const { error } = await supabase
      .from("users")
      .update({ followers: value })
      .eq("id", uid);
  }

  async function updateExportedFollowersById(ids: string[]) {
    let funcFollowers: DbUser[] = [];
    for (let i = 0; i < ids.length; i++) {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("id", ids[i])
        .single();

      if (data) {
        funcFollowers = [...funcFollowers, data];
        if (i === ids.length - 1) {
          followersAsUsers = funcFollowers;
        }
      }
    }
  }

  async function getFollowers() {
    const { data: thisUser } = await supabase
      .from("users")
      .select()
      .eq("id", uid)
      .single();

    if (thisUser) {
      let funcFollowers: DbUser[] = [];
      for (let i = 0; i < thisUser.followers.length; i++) {
        const { data: follower } = await supabase
          .from("users")
          .select()
          .eq("id", thisUser.followers[i])
          .single();

        follower && funcFollowers.push(follower);

        thisUser.followers.length === funcFollowers.length &&
          i === thisUser.followers.length - 1 &&
          (followersAsUsers = funcFollowers);
      }
    }
  }

  onMount(() => {
    getFollowers();
  });
</script>

{#if currDbUser && user}
  {#if user.id !== currDbUser.id}
    <button
      class={strictClasses
        ? followed
          ? unfollowClass
          : btnClass
        : `${btnClass} ${followed ? unfollowClass : ""}`}
      on:click={(e) => {
        e.preventDefault();
        follow();
      }}>{followed ? unfollowText : followText}</button
    >
  {:else if showEditingButtonWhenCurrUser}
    <a href={`/${user.url_username}?edit`} class={btnClass}>Edit</a>
  {/if}
{/if}
