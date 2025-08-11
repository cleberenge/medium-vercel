-- Crie a base e rode este script no Neon/psql
create table if not exists posts (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  content text not null,
  tags text[] not null default '{}',
  cover_url text,
  status text not null default 'draft', -- draft | scheduled | published
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_published_at on posts (published_at);
create index if not exists idx_posts_status on posts (status);
