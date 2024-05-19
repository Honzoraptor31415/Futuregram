# Futuregram

<br/>

A Social media webapp similar to Instagram. Made because I kinda enjoy making full-stack webapps 👍.
Btw, the last time I tried to make something more complicated with SvelteKit and a BaaS, it didn't end up well (that project is deleted tho).

But I think, that it was because I was a beginner and I used <span style="color:yellow">Firebase</span>. And I didn't even use it the right way - the file structure was basicly ~~f\*cked~~ **screwed** and I constantly had problems with user auth.

**However** I think, that this one will turn out to be good.

And also, I'm making all of my projects myself, with no tutorials whatsoever, because watching someone code for 5 hours **isn't the right way** to learn programming.

## Technologies/languages this project uses:

<br/>

[![Technologies used](https://skillicons.dev/icons?i=svelte,typescript,supabase)](/)

## Database schema

Btw I'm using supabase's database, which means it's Postgres.

#### users table

| Name               | Type      | Description                                                   |
| ------------------ | --------- | ------------------------------------------------------------- |
| id                 | `uuid`    | User's ID                                                     |
| joined_at          | `int8`    | When the user joined                                          |
| url_username       | `text`    | Username that can be used in a URL                            |
| displayed_username | `text`    | A username that can ex. contain spaces and special characters |
| bio                | `text`    | User's bio                                                    |
| image_url          | `int8`    | User's profile pic URL                                        |
| follows            | `jsonb[]` | Array of IDs of users who the user follows                    |
| followers          | `jsonb[]` | Array of IDs of users who follow this user                    |
| blocked            | `jsonb[]` | Array of IDs of users who this user blocked                   |
| saved              | `jsonb[]` | Array of IDs of posts that the user saved                     |

#### posts table

| Name        | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| id          | `uuid`    | Post's ID                             |
| created_at  | `int8`    | Post creation time (milliseconds)     |
| likes       | `jsonb[]` | An array of IDs of users who liked it |
| image_urls  | `text[]`  | The post's image URL                  |
| user_id     | `uuid`    | ID of the user who made the post      |
| description | `text`    | Post description                      |
| title       | `text`    | Post title                            |

#### comments table

| Name       | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| id         | `uuid`    | Comment ID                           |
| created_at | `int8`    | Comment creation time (milliseconds) |
| likes      | `jsonb[]` | Array of IDs of users who liked it   |
| post_id    | `uuid`    | ID of the post where the comment is  |
| user_id    | `uuid`    | ID of the user who made it           |
| text       | `text`    | Text of the comment                  |
| edited     | `bool`    | If the comment was ever edited       |

#### replies table

| Name       | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| id         | `uuid`    | Comment ID                           |
| created_at | `int8`    | Comment creation time (milliseconds) |
| likes      | `jsonb[]` | Array of IDs of users who liked it   |
| comment_id | `uuid`    | ID of the post where the comment is  |
| user_id    | `uuid`    | ID of the user who made it           |
| text       | `text`    | Text of the reply                    |
| post_id    | `uuid`    | ID of the post where the reply is    |
| edited     | `bool`    | If the reply was ever edited         |
