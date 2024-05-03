import psycopg2

connection = psycopg2.connect(
host="dpg-coqeq0n79t8c738ftvtg-a",
port=5432, # Порт PostgreSQL по умолчанию
database="memo_t5re", # Имя базы данных
user="rupollya",
password="qGb6Cto57ToPL8nGDlkprsIXGNKPjV2J",
)
mycursor = connection.cursor()

mycursor.execute("CREATE TABLE Users (user_id SERIAL PRIMARY KEY, phone_number VARCHAR(11) UNIQUE, password VARCHAR(255), name VARCHAR(50), surname VARCHAR(50), email VARCHAR(255), about_me TEXT, photo BYTEA);")
mycursor.execute("CREATE TABLE NoteTemplates (template_id SERIAL PRIMARY KEY, template_name VARCHAR(255), template_text TEXT);")
mycursor.execute("CREATE TABLE Notes (note_id SERIAL PRIMARY KEY, user_id INTEGER, template_id INTEGER, title VARCHAR(30), text TEXT, created_at TIMESTAMP, FOREIGN KEY (user_id) REFERENCES Users(user_id), FOREIGN KEY (template_id) REFERENCES NoteTemplates(template_id));")
connection.commit()
mycursor.close()
connection.close()