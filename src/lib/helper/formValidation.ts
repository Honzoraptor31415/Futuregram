import { supabase } from "$lib/supabaseClient";

export function emailCheck(email: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (email.length < 1) {
    check.message = "Email can't be empty";
    check.isValid = false;
  } else if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ||
    email.length > 255
  ) {
    check.message = "Invalid email";
    check.isValid = false;
  }

  return check;
}

export function passwordCheck(password: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (password.length < 1) {
    check.message = "Password can't be empty";
    check.isValid = false;
  } else if (password.length < 6) {
    check.message = "Password is too short";
    check.isValid = false;
  }

  return check;
}

export async function usernameCheck(username: string) {
  const { data: dbUsers } = await supabase.from("users").select();
  let takenUsernames: string[] = [];

  if (dbUsers) {
    takenUsernames = dbUsers.map(({ url_username }) => url_username);
  }

  const allowedUsernameChars = "abcdefghijklmnopqrstuvwxyz1234567890.-";
  const disallowedUsernames = [
    "feed",
    "login",
    "signup",
    "chat",
    "about",
    "search",
  ];
  const containsOnlyAllowedChars = username
    .toLocaleLowerCase()
    .match(`^[${allowedUsernameChars}]+$`);
  const isDisallowedUsername = disallowedUsernames.includes(
    username.toLocaleLowerCase()
  );

  const check = {
    message: "",
    isValid: true,
  };

  if (username.length < 1) {
    check.message = "Username can't be empty";
    check.isValid = false;
  } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
    check.message = "Invalid username";
    check.isValid = false;
  } else if (username.length > 30) {
    check.message = "Username is too long";
    check.isValid = false;
  } else if (takenUsernames.includes(username)) {
    check.message = "Username already taken";
    check.isValid = false;
  }

  return check;
}

export function displayedNameCheck(displayedName: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (displayedName.length < 1) {
    check.message = "Name can't be empty";
    check.isValid = false;
  } else if (displayedName.length > 30) {
    check.message = "Name is too long";
    check.isValid = false;
  }

  return check;
}

export function bioCheck(bio: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (bio.length < 1) {
    check.message = "Bio can't be empty";
    check.isValid = false;
  } else if (bio.length > 200) {
    check.message = "Bio is too long";
    check.isValid = false;
  }

  return check;
}

export function titleCheck(title: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (title.length < 1) {
    check.message = "Title can't be empty";
    check.isValid = false;
  } else if (title.length > 200) {
    check.message = "Title is too long";
    check.isValid = false;
  }

  return check;
}

export function descriptionCheck(description: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (description.length > 500) {
    check.message = "Description is too long";
    check.isValid = false;
  }

  return check;
}

export function imageCheck(imageData: string, type: string, size: number) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxImageSize = 10_000;

  const check = {
    message: "",
    isValid: true,
  };

  if (!allowedTypes.includes(type)) {
    check.message = "Invalid file type";
    check.isValid = false;
  } else if (size > maxImageSize) {
    check.message = "Image is too big";
    check.isValid = false;
  }

  return check;
}

export function commentCheck(comment: string) {
  const check = {
    message: "",
    isValid: true,
  };

  if (comment.length < 1) {
    check.message = "Comment can't be empty";
    check.isValid = false;
  } else if (comment.length > 600) {
    check.message = "Comment is too long";
    check.isValid = false;
  }

  return check;
}
