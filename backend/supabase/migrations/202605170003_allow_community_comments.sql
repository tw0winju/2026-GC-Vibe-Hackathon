ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_post_type_check;

ALTER TABLE comments
  ADD CONSTRAINT comments_post_type_check
  CHECK (post_type IN ('resume', 'project', 'community'));
