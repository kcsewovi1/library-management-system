-- CREATE DATABASE library;
-- USE library;

-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(50) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE books (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     author VARCHAR(255) NOT NULL,
--     genre VARCHAR(100) NOT NULL,
--     published_date DATE NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );
