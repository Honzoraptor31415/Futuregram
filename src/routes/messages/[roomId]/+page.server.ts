import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async (e) => {
  const supabase = e.locals.supabase;

  // some logic
};
