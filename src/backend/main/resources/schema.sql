
-- Створення таблиці користувачів
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    bio_link VARCHAR(255)
);

-- Створення таблиці профалів
CREATE TABLE profiles (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    bio VARCHAR(255),
    avatar_hash VARCHAR(255)
);

-- Створення таблиці завдань
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_address VARCHAR(255) NOT NULL,
    executor_address VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    budget DECIMAL NOT NULL,
    deadline TIMESTAMP NOT NULL,
    is_completed BOOLEAN NOT NULL,
    is_confirmed BOOLEAN NOT NULL,
    is_in_arbitration BOOLEAN NOT NULL
);

-- Створення таблиці арбітражів
CREATE TABLE arbitrations (
    task_id BIGINT PRIMARY KEY,
    owner_address VARCHAR(255) NOT NULL,
    executor_address VARCHAR(255) NOT NULL,
    arbiter_address VARCHAR(255) NOT NULL,
    budget DECIMAL NOT NULL,
    resolved BOOLEAN NOT NULL,
    winner VARCHAR(255)
);

-- Створення таблиці рейтингів
CREATE TABLE ratings (
    user_id VARCHAR(255) PRIMARY KEY,
    total_rating INT NOT NULL,
    rating_count INT NOT NULL
);

-- Створення таблиці коментарів до рейтингів
CREATE TABLE rating_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating_user_id VARCHAR(255) NOT NULL,
    comments VARCHAR(255) NOT NULL
);
