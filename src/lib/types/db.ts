export type DbUser = {
  bio: string;
  displayed_username: string;
  followers: string[];
  follows: string[];
  id: string;
  image_url: string;
  joined_at: number;
  url_username: string;
  blocked: string[];
  saved: string[];
};

export type DbPost = {
  created_at: number;
  description: string;
  id: string;
  image_urls: string[];
  likes: string[];
  user_id: string;
};

export type DbComment = {
  created_at: number;
  id: string;
  likes: string[];
  post_id: string;
  text: string;
  user_id: string;
  edited: boolean | null;
};

export interface DbReply extends DbComment {
  comment_id: string;
}
