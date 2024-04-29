import type { DBUserData } from "$lib/types/db"

export type MenuElement = {
  class: string,
  type: string,
  href?: string,
  text: string,
  onClick?: any
}

export type ReplyingToComment = { commentID: string; commentCreator: DBUserData } | null