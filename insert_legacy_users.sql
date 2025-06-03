-- Insert legacy admin and user accounts into the users table
INSERT INTO users (id, username, email, password_hash, chat_context)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@example.com',
  '$2b$10$wH8Qw8Qw8Qw8Qw8Qw8Qw8OeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8QW', -- bcrypt hash for 'admin123' (placeholder)
  'Admin chat context here'
);

INSERT INTO users (id, username, email, password_hash, chat_context)
VALUES (
  gen_random_uuid(),
  'user',
  'user@example.com',
  '$2b$10$wH8Qw8Qw8Qw8Qw8Qw8Qw8OeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8QW', -- bcrypt hash for 'user123' (placeholder)
  'User chat context here'
);
