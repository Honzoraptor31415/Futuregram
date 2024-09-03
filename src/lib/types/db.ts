export interface DbUser {
  id: string;
  url_username: string;
  displayed_username: string;
  bio: string;
  image_url: string;
  following: string[] | null;
  followers: string[] | null;
  saved: string[] | null;
  blocked: string[] | null;
  joined_at: string;
  rooms: string[] | null;
  last_seen: DbLastSeen[];
}

export interface DbPost {
  id: string;
  user_id: string;
  description: string | null;
  image_urls: string[] | null;
  likes: string[] | null;
  replying_to: string | null;
  edited: boolean;
  created_at: string;
}

export interface DbMessage {
  id: string;
  type: "message" | "log";
  text: string | null;
  user_id: string;
  room_id: string;
  image_urls: string[] | null;
  edited: boolean;
  reactions: DbMessageReaction[] | null;
  created_at: string;
}

export interface DbReport {
  id: string;
  type: "post" | "user";
  text: string;
  reported_element_id: string;
  created_by: string;
  created_at: string;
}

export interface DbMessageReaction {
  user_id: string;
  reaction: string;
}

export interface DbRoom {
  id: string;
  created_at: string;
}

export interface DbLastSeen {
  room_id: string;
  timestamp: string;
}
