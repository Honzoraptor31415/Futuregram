import * as validation from "$lib/helper/formValidation";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, locals }) => {
  const supabase = locals.supabase;

  const id = url.searchParams.get("id");

  if (!id) {
    return json({ ok: false, message: 'URL parameter "id" is missing.' });
  }

  const { data, error: resError } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();

  if (resError) {
    return json({
      ok: false,
      message: resError?.message,
    });
  }

  return json({
    ok: true,
    body: data,
  });
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const supabase = locals.supabase;
  const { user: authUser } = await locals.safeGetSession();
  const body = await request.json();
  const bodyKeys = Object.keys(body);
  const expectedBodyLength = 3;

  if (!authUser) {
    return json({
      ok: false,
      message: "You have to be signed in",
    });
  } else if (bodyKeys.length === 0) {
    return json({
      ok: false,
      message: "Please provide data",
    });
  } else if (bodyKeys.length > expectedBodyLength) {
    return json({
      ok: false,
      message: "Unexpected data",
    });
  } else if (bodyKeys.length < expectedBodyLength) {
    return json({
      ok: false,
      message: "Missing property",
    });
  }

  const { data: currentUserDbData } = await supabase
    .from("users")
    .select()
    .eq("id", authUser.id);

  if (currentUserDbData && currentUserDbData.length > 0) {
    return json({
      ok: false,
      message: "A user with this auth id already exists",
    });
  }

  const { urlUsername, displayedUsername, bio } = body;

  const usernameCheck = await validation.usernameCheck(urlUsername);
  const displayedUsernameCheck =
    validation.displayedNameCheck(displayedUsername);
  const bioCheck = validation.bioCheck(bio);

  if (!usernameCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  } else if (!displayedUsernameCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  } else if (!bioCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  }

  const { error: resError } = await supabase.from("users").insert({
    id: authUser.id,
    url_username: urlUsername,
    displayed_username: displayedUsername,
    bio,
  });

  if (resError) {
    return json({
      ok: false,
      message: resError.message,
    });
  }

  return json({
    ok: true,
    message: "Data inserted succesfully",
  });
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
  const supabase = locals.supabase;
  const { user: authUser } = await locals.safeGetSession();
  const body = await request.json();
  const bodyKeys = Object.keys(body);
  const maxBodyLength = 3;

  const unupdatableColumns = [
    "id",
    "joined_at",
    "image_url",
    "following",
    "followers",
    "saved",
    "blocked",
    "rooms",
    "last_seen",
  ];

  for (let i = 0; i < bodyKeys.length; i++) {
    if (unupdatableColumns.includes(bodyKeys[i])) {
      return json({
        ok: false,
        message: `Cannot update column ${bodyKeys[i]}`,
      });
    }
  }

  if (!authUser) {
    return json({
      ok: false,
      message: "You have to be signed in",
    });
  } else if (bodyKeys.length === 0) {
    return json({
      ok: false,
      message: "Please provide data",
    });
  } else if (bodyKeys.length > maxBodyLength) {
    return json({
      ok: false,
      message: "Unexpected data",
    });
  }

  const { urlUsername, displayedUsername, bio } = body;

  const usernameCheck = await validation.usernameCheck(urlUsername);
  const displayedUsernameCheck =
    validation.displayedNameCheck(displayedUsername);
  const bioCheck = validation.bioCheck(bio);

  if (urlUsername && !usernameCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  } else if (displayedUsername && !displayedUsernameCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  } else if (bio && !bioCheck.isValid) {
    return json({
      ok: false,
      checks: {
        username: {
          isValid: usernameCheck.isValid,
          message: usernameCheck.message,
        },
        displayedUsername: {
          isValid: displayedUsernameCheck.isValid,
          message: displayedUsernameCheck.message,
        },
        bio: {
          isValid: bioCheck.isValid,
          message: bioCheck.message,
        },
      },
    });
  }

  const { error: resError } = await supabase
    .from("users")
    .update({
      body,
    })
    .eq("id", authUser.id);

  if (resError) {
    return json({
      ok: false,
      message: resError.message,
    });
  }

  return json({
    ok: true,
    message: "Data updated succesfully",
  });
};
