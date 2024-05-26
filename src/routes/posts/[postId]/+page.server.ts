import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ params }: any) => {
  const { data } = await supabase
    .from("posts")
    .select()
    .eq("id", params.postId)
    .single();

  if (data) {
    return {
      id: data.id,
      description: data.description,
      likes: data.likes,
      image_urls: data.image_urls,
      user_id: data.user_id,
      created_at: data.created_at,
    };
  }
};
