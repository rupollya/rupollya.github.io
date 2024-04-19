USE usersdb;
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    phone_number VARCHAR(11) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(50),
    surname VARCHAR(50),
    email VARCHAR(255),
    about_me TEXT,
    photo BLOB,
    created_at DATE
);
CREATE TABLE NoteTemplates ( 
    template_id INT PRIMARY KEY, 
    template_name VARCHAR(255), 
    template_text TEXT 
);
CREATE TABLE Notes (
    note_id INT PRIMARY KEY,
    user_id INT,
    template_id INT,
    title VARCHAR(30),
    text TEXT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (template_id) REFERENCES NoteTemplates(template_id)
);