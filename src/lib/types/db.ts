export interface DbUser {
  bio: string;
  blocked: string[] | null;
  displayed_username: string;
  followers: string[] | null;
  following: string[] | null;
  id: string;
  image_url: string;
  joined_at: number;
  muted: string[] | null;
  rooms: string[] | null;
  saved: string[] | null;
  settings: any | null;
  url_username: string;
}

export interface DbPost {
  created_at: number;
  description: string | null;
  edited: boolean | null;
  id: string;
  image_urls: string[] | null;
  likes: string[] | null;
  replying_to: string | null;
  user_id: string;
}

export interface DbMessage {
  created_at: number;
  edited: boolean | null;
  id: string;
  image_urls: string[] | null;
  reactions: DbMessageReaction[] | null;
  room_id: string;
  text: string | null;
  type: string;
  user_id: string;
}

export interface DbReport {
  created_at: number;
  created_by: string;
  id: string;
  reported_element_id: string;
  text: string;
  type: string;
}

export interface DbMessageReaction {
  user_id: string;
  reaction: string;
}

export interface DbRoom {
  active_users: string[] | null;
  created_at: number;
  id: string;
  members: string[];
  room_members_info: RoomMember[] | null;
}

export interface RoomMember {
  id: string;
  last_seen: number;
}
