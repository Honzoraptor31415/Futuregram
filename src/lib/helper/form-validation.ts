import { supabase } from "$lib/supabaseClient";

export function emailCheck(email: string) {
  if (email.length < 1) {
    return "Email can't be empty";
  } else if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ||
    email.length > 255
  ) {
    return "Invalid email";
  } else {
    return "";
  }
}

export function passwordCheck(password: string) {
  if (password.length < 1) {
    return "Password can't be empty";
  } else if (password.length < 6) {
    return "Password is too short";
  } else {
    return "";
  }
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

  if (username.length < 1) {
    return "Username can't be empty";
  } else if (!containsOnlyAllowedChars || isDisallowedUsername) {
    return "Invalid username";
  } else if (username.length > 30) {
    return "Username is too long";
  } else if (takenUsernames.includes(username)) {
    return "Username already taken";
  } else {
    return "";
  }
}

export function displayedNameCheck(displayedName: string) {
  if (displayedName.length < 1) {
    return "Name can't be empty";
  } else if (displayedName.length > 30) {
    return "Name is too long";
  } else {
    return "";
  }
}

export function bioCheck(bio: string) {
  if (bio.length < 1) {
    return "Bio can't be empty";
  } else if (bio.length > 200) {
    return "Bio is too long";
  } else {
    return "";
  }
}

export function titleCheck(title: string) {
  if (title.length < 1) {
    return "Title can't be empty";
  } else if (title.length > 200) {
    return "Title is too long";
  } else {
    return "";
  }
}

export function descriptionCheck(description: string) {
  if (description.length > 500) {
    return "Description is too long";
  } else {
    return "";
  }
}

export function imageCheck() {
  // some logic, that I'll make later :D
  return "";
}

export function editingValueCheck(editingValue: string) {
  if (editingValue.length < 1) {
    return "Text can't be empty";
  } else if (editingValue.length > 500) {
    return "Text is too long";
  } else {
    return "";
  }
}

export function commentCheck(comment: string) {
  if (comment.length < 1) {
    return "Comment can't be empty";
  } else if (comment.length > 600) {
    return "Comment is too long";
  } else {
    return "";
  }
}
