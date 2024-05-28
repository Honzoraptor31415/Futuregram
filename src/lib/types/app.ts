import type { DbUser } from "$lib/types/db";

export type MenuElement = {
  class: string;
  type: string;
  href?: string;
  text: string;
  onClick?: any;
};

export type ReplyingToComment = {
  commentId: string;
  commentCreator: DbUser;
} | null;

export type AppNotification = {
  text: string;
  id: number;
  disappearing: boolean;
  linkHref?: string;
  linkText?: string;
};

export type ActionWarning = {
  heading: string;
  text: string;
  func: () => void;
  continueBtnText?: string;
};
