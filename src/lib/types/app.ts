export type MenuElement = {
  class: string,
  type: string,
  href?: string,
  text: string,
  onClick?: any
}

export type ReplyingToComment = { commentID: string; commentUsername: string } | null