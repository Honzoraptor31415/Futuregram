import type { DbUser } from "$lib/types/db";

export interface MenuElement {
  class: string;
  type: string;
  href?: string;
  text: string;
  onClick?: any;
}

export type ReplyingToComment = {
  commentId: string;
  commentCreator: DbUser;
} | null;

export interface AppNotification {
  text: string;
  id: number;
  disappearing: boolean;
  linkHref?: string;
  linkText?: string;
}

export interface ActionWarning {
  heading: string;
  text: string;
  func: () => void;
  continueBtnText?: string;
}
