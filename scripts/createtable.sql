CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE wish_list (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      text NOT NULL,
  note       text,
  completed  boolean NOT NULL DEFAULT false,
  is_active   boolean NOT NULL DEFAULT true
);