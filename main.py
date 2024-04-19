import mysql.connector

connection = mysql.connector.connect(
    host="localhost",
    port=3305,
    user="root",
    password="owIbyag820022013",
    database="usersdb",
)
cursor = connection.cursor()
#############sql_query = "INSERT INTO Users ( phone_number, password) VALUES ( %s, %s)"
#############sql_query = "INSERT INTO Notes ( title,text) VALUES ( %s, %s)"
#####title = "зима"
#####text = "путешествие в никуда"
# phone_number = "88965431817"
# password = "2089375928ВЫ"
# cursor.execute(sql_query, ( phone_number, password))
#####cursor.execute(sql_query, ( title,text))
######################################################################################
# sql_query = "SELECT * FROM Notes"
# cursor.execute(sql_query)
# notes = cursor.fetchall()
# for note in notes:
#    print("Title:", note[3])
#    print("Text:", note[4])
#    print()
sql_query = "SELECT * FROM Notes WHERE title = %s"
title = ("лето",)

cursor.execute(sql_query, title)
notes = cursor.fetchall()

for note in notes:
    print("Title:", note[3])
    print("Text:", note[4])
    print()
connection.commit()
cursor.close()
connection.close()
