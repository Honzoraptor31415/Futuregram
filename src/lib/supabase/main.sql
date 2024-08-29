CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at BIGINT NOT NULL,
    edited BOOLEAN,
    image_urls TEXT[],
    reactions JSONB[],
    room_id UUID NOT NULL,
    text TEXT,
    type TEXT,
    user_id UUID NOT NULL
);

CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL,
    created_at BIGINT NOT NULL,
    description TEXT,
    edited BOOLEAN,
    image_urls TEXT[],
    likes UUID[],
    replying_to UUID,
    user_id UUID
);

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at BIGINT NOT NULL,
    created_by UUID NOT NULL,
    reported_element_id UUID NOT NULL,
    text TEXT NOT NULL,
    type TEXT NOT NULL
);

CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at BIGINT NOT NULL,
    active_users UUID[],
    members UUID[] NOT NULL,
    room_members_info JSONB[]
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID,
    bio TEXT,
    blocked UUID[],
    displayed_username TEXT,
    followers UUID[],
    following UUID[],
    image_url TEXT,
    joined_at BIGINT NOT NULL,
    muted UUID[],
    rooms UUID[],
    saved UUID[],
    settings JSONB,
    url_username TEXT
);
