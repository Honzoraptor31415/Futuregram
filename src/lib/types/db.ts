export type DBUserData = {
  bio: string,
  displayed_username: string,
  followers: string[],
  follows: string[],
  id: string,
  image_url: string,
  joined_at: number,
  url_username: string
}

export type DBPost = {
  created_at: number,
  description: string,
  id: string,
  image_url: string,
  likes: string[],
  title: string,
  user_id: string
}

export type DBComment = {
  created_at: number
  id: string
  likes: string[]
  post_id: string
  text: string
  user_id: string
}