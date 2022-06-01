CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE item (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  note text,
  color text DEFAULT 'default',
  completed boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  position numeric,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  item_list_id uuid REFERENCES item_list(id)
);
CREATE TABLE item_list (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id text REFERENCES users(id)
);
CREATE TABLE tag (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  user_id text REFERENCES users(id),
  shared_to text REFERENCES users(id),
  UNIQUE (name, user_id)
);
CREATE TABLE item_list_tag (
  item_list_id uuid REFERENCES item_list(id),
  tag_id uuid REFERENCES tag(id),
  PRIMARY KEY (item_list_id, tag_id)
);
CREATE OR REPLACE VIEW user_tag AS
SELECT t.id AS tag_id,
  u.id AS user_id,
  l.id AS item_list_id
FROM tag t,
  users u,
  item_list l
WHERE (t.name = u.email);