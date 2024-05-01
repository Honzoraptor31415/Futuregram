import { supabase } from "$lib/supabaseClient";
import type { DBPost } from "$lib/types/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const { data:usernamesData } = await supabase.from("users").select();
  const usernames = usernamesData?.map(({ url_username }) => url_username)
  let posts: DBPost[] = []
  let noPosts: boolean = false

  const { data:postsData } = await supabase.from("posts").select();
    if (postsData) {
      postsData
        .sort((a: any, b: any) => {
          return a.likes ? a.likes.length : 0 - b.likes ? b.likes.length : 0;
        })
      posts = postsData;
    } else {
      noPosts = true;
    }

  return {
    usernames: usernames ?? [],
    url: url.origin,
    posts: posts,
    noPosts: noPosts
  };
}