import * as validation from "$lib/helper/formValidation";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, locals }) => {
  const supabase = locals.supabase;

  const id = url.searchParams.get("id");

  if (!id) {
    error(400, 'URL parameter "id" is missing.');
  }

  const { data, error: resError } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();

  if (resError) {
    error(500, resError.message);
  }

  return new Response(data);
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const supabase = locals.supabase;
  const { user: authUser } = await locals.safeGetSession();

  if (!authUser) {
    error(400, "You have to be signed in");
  }

  const { data: currentUserDbData } = await supabase
    .from("users")
    .select()
    .eq("id", authUser.id);

  if (currentUserDbData && currentUserDbData.length > 0) {
    error(400, "A user with this auth id already exists");
  }

  const { urlUsername, displayedUsername, bio } = await request.json();

  const usernameCheck = await validation.usernameCheck(urlUsername);
  const displayedUsernameCheck =
    validation.displayedNameCheck(displayedUsername);
  const bioCheck = validation.bioCheck(bio);

  if (!usernameCheck.isValid) {
    error(400, usernameCheck.message);
  } else if (!displayedUsernameCheck.isValid) {
    error(400, displayedUsernameCheck.message);
  } else if (!bioCheck.isValid) {
    error(400, bioCheck.message);
  }

  const { error: resError } = await supabase.from("users").insert({
    id: authUser.id,
    url_username: urlUsername,
    displayed_username: displayedUsername,
    bio,
  });

  if (resError) {
    error(500, resError.message);
  }

  return new Response("Inserted successfully");
};
