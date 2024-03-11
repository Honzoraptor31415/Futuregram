# Futuregram
<br/>

A Social media webapp similar to Instagram. Made because I kinda enjoy making full-stack webapps 👍.
Btw, the last time I tried to make something more complicated with SvelteKit and a BaaS, it didn't end up well (with that I don't mean the URL Shortener, but CodeConnect).

But I think, that it was because I was a beginner and I used <span style="color:yellow">Firebase</span>. And I didn't even use it the right way - the file structure was basicly ~~f*cked~~ **screwed** and I constantly had problems with user auth.

__However__ I think, that this one will turn out to be good.

And also, I'm making all of my projects myself, with no tutorials whatsoever, because watching someone code for 5 hours **isn't the right way** to learn programming.

## Technologies/languages this project uses:
<br/>

[![Technologies used](https://skillicons.dev/icons?i=svelte,typescript,supabase)](/)

## Database schema
Btw I'm using supabase's database, which means it's Postgres.

#### users table

| Name | Type | Description |
| --- | --- | --- |
| id | `uuid` | User's ID |
| joined_at | `int8` | When the user joined |
| url_username | `text` | Username that can be used in a URL |
| displayed_username | `text` | A username that can ex. contain spaces and special characters |
| bio | `text` | User's bio |
| image_url | `int8`| User's profile pic URL |

#### posts table

| Name | Type | Description |
| --- | --- | --- |
| id | `uuid` | Post's ID |
| created_at | `int8` | Post creation time (milliseconds) |
| likes | `json` | An array of users who liked it |
| image_url | `text` | The post's image URL |
| user_id | `uuid` | ID of the user who made the post |
| description | `text` | Post description |
| likes_count | `int8`| Number of likes |
| title | `text` | Post title |
| user_image | `text` | User's profile pic URL |
| created_by_username | `text` | Who the post is created by |
| comments_count | `int8` | Number of comments |

#### comments table

| Name | Type | Description |
| --- | --- | --- |
| id | `uuid` | Comment ID |
| created_at | `int8` | Comment creation time (milliseconds) |
| likes | `json` | Array of user's who liked it |
| post_id | `uuid` | ID of the post where the comment is |
| likes_count | `int8` | Number of likes |
| user_id | `uuid` | ID of the user who made it |
