export function emailCheck(email: string) {
  if (email.length < 1) {
    return "Email can't be empty";
  } else if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
    return ""
  }
}