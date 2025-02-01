-- Додавання користувачів
INSERT INTO users (id, username, bio, bio_link)
VALUES ('0x123', 'Alice', 'Alice bio', 'link'),
       ('0x456', 'Bob', 'Bob  bio', 'link'),
       ('0x789', 'Charlie', 'Charlie  bio', 'link');

-- Додавання профайлів
INSERT INTO profiles (id, username, bio, avatar_hash)
VALUES ('0x123', 'Alice', 'Alice bio', 'avatar_hash'),
       ('0x456', 'Bob', 'Bob  bio', 'avatar_hash'),
       ('0x789', 'Charlie', 'Charlie  bio', 'avatar_hash');

-- Додавання завдань
INSERT INTO tasks (owner_address, executor_address, description, budget, deadline, is_completed, is_confirmed, is_in_arbitration)
VALUES ('0x123', NULL, 'First task', 50.0, '2025-01-30T23:59:59', FALSE, FALSE, FALSE),
       ('0x456', NULL, ' Second task', 100.0, '2025-02-01T23:59:59', FALSE, FALSE, FALSE);

-- Додавання рейтингів
INSERT INTO ratings (user_id, total_rating, rating_count)
VALUES ('0x123', 500, 1),
       ('0x456', 400, 2);

-- Коментарі до рейтингів
INSERT INTO rating_comments (rating_user_id, comments)
VALUES ('0x123', 'Great work!'),
       ('0x456', 'Good job'),
       ('0x456', 'Could be faster');
