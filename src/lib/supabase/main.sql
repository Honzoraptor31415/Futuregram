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

-- Triggers

-- Functions
