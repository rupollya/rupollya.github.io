import mysql.connector

connection = mysql.connector.connect(
    host="localhost",
    port=3305,
    user="root",
    password="owIbyag820022013",
    database="memo",
)
cursor = connection.cursor()
sql_query = "INSERT INTO NoteTemplates (template_name, template_text) VALUES (%s, %s)"
template_name='числовой список'
template_text='1:\n2:\n3:\n4:\n5:\n6:\n7:\n8:\n9:\n'
cursor.execute(sql_query, (template_name, template_text))
connection.commit()
cursor.close()
connection.close()