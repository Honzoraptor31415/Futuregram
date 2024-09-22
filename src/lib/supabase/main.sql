-- Tables

create table public.messages (
    id uuid primary key default gen_random_uuid(),
    created_at bigint not null,
    edited boolean,
    image_urls text[],
    reactions jsonb[],
    room_id uuid not null,
    text text,
    type text,
    user_id uuid not null
);

create table public.posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid,
    description text,
    image_urls text[],
    likes uuid[],
    replying_to uuid,
    edited boolean not null,
    created_at timestampz not null,
);

create table public.reports (
    id uuid primary key default gen_random_uuid(),
    created_at bigint not null,
    created_by uuid not null,
    reported_element_id uuid not null,
    text text not null,
    type text not null
);

create table public.rooms (
    id uuid primary key default gen_random_uuid(),
    created_at bigint not null,
    active_users uuid[],
    members uuid[] not null,
    room_members_info jsonb[]
);

create table public.users (
    id uuid primary key default gen_random_uuid(),
    url_username text not null,
    displayed_username text,
    bio text,
    image_url text,
    following uuid[],
    followers uuid[],
    saved uuid[],
    blocked uuid[],
    joined_at timestampz not null,
    rooms uuid[],
    last_seen: jsonb[]
);

-- Policies

create policy "Enable read access for all users"
on public.users
as permissive
for select
to public
using (
    true
);

create policy "Enable insert for users if they don't have a row yet"
on public.users
as permissive
for insert
to authenticated
with check (
    (select Count(*) from public.users where id=auth.uid()) = 0
);

create policy "Enable update for users based on their id"
on public.users
as permissive
for update
to public
using (
  (select id) = auth.uid()
);

create policy "Enable read access for all users"
on public.posts
as permissive
for select
to public
using (
    true
);

create policy "Enable insert for authenticated users"
on public.posts
as permissive
for insert
to authenticated
with check (
    true
);

-- Triggers

-- Functions
