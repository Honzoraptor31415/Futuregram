import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
  console.log(locals);

  if (locals.loggedIn) {
    throw redirect(302, "/")
  }
}