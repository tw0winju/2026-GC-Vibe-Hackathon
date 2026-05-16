create table if not exists public.project_posts (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  comment_id bigint,
  file_url text,
  thumbnail text,
  description text not null,
  "like" integer not null default 0,
  title text not null,
  position text not null check (position in ('웹 개발', '앱 개발', '백엔드', 'AI/ML', '인프라', '보안', '네트워크', '기획')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_post_likes (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.project_posts(id) on delete cascade,
  user_id bigint not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists project_posts_position_idx on public.project_posts(position);
create index if not exists project_posts_like_idx on public.project_posts("like" desc);

-- 상세 조회에서 댓글까지 반환하려면 comments 테이블에 아래 컬럼이 있어야 합니다.
-- post_type text check (post_type in ('project', 'resume'))
-- post_id bigint
-- content text
