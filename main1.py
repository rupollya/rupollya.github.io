from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jwt
import psycopg2
import datetime
from datetime import datetime
from typing import Optional
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.staticfiles import StaticFiles
import base64
app = FastAPI()


connection = psycopg2.connect(
    host="dpg-coqeq0n79t8c738ftvtg-a",
    port=5432,
    user="rupollya",
    password="qGb6Cto57ToPL8nGDlkprsIXGNKPjV2J",
    database="memo_t5re",
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def main1():
    return FileResponse("index.html")


@app.get("/regis.html")
def get_regis_html():
    return FileResponse("regis.html")


@app.get("/osnova.html")
def get_regis_html():
    return FileResponse("osnova.html")


@app.get("/redak.html")
def get_regis_html():
    return FileResponse("redak.html")


# -------для таблицы USERS
class user_reg_log(BaseModel):
    phone_number: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    about_me: Optional[str] = None
    photo: Optional[bytes] = None


# -------для таблицы шаблонов
class notes_tem(BaseModel):
    template_name: Optional[str] = None
    template_text: Optional[str] = None


# ------------для таблицы заметок
class NoteCreate(BaseModel):
    user_id: Optional[int] = None
    template_id: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None


# ------------------------ТАБЛИЦА USERS-------------------------------
# Получить список всех пользователей
@app.get("/users")
def get_users():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Users")
    result = cursor.fetchall()  # возвращаем все строки в виде списка
    cursor.close()
    return {"Users": result}


# Получить информацию о пользователе по ID
@app.get("/users/{id}")
def get_user_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM users WHERE user_id = {id}")
    user = (
        cursor.fetchone()
    )  # возвращает следующую строку результата запроса как кортеж
    if user:
        user_data = {
            "phone_number": user[1],
            "password": user[2],
            "name": user[3],
            "surname": user[4],
            "email": user[5],
            "about_me": user[6]
        }
        return {"status": "success", "data": user_data}
    else:
        return {"status": "error", "message": "Пользователь не найден","data": user_data}





# Удалить пользователя по ID
@app.delete("/users/{id}")
def delete_user_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM users WHERE user_id = {id}")
    result = cursor.fetchone()
    if result:
        cursor.execute(f"DELETE FROM users WHERE user_id = {id}")
        connection.commit()
        return {"message": "Пользователь удалён"}
    else:
        return {"message": "Пользователь не найден"}


# Регистрация нового пользователя
@app.post("/users/register")
def regis_new_user(user_data: user_reg_log):
    cursor = connection.cursor()
    # есть ли такой пользователь?
    user_look = "SELECT * FROM Users WHERE phone_number = %s"
    user_data_ch = (user_data.phone_number,)
    cursor.execute(user_look, user_data_ch)
    answer = cursor.fetchone()
    if not user_data.phone_number or not user_data.password:
        raise HTTPException(status_code=400, detail="Не заполнены обязательные поля")
    if answer:
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким номером телефона уже существует)",
        )

    # иначе новый пользователь
    sql = "INSERT INTO Users (phone_number, password) VALUES (%s, %s)"
    val = (user_data.phone_number, user_data.password)
    cursor.execute(sql, val)
    connection.commit()
    return {"message": "Успешный вход, пользователь найден"}


@app.post("/users/login")
def login_user(user_data: user_reg_log):
    if not user_data.phone_number or not user_data.password:
        raise HTTPException(status_code=400, detail="Не заполнены обязательные поля")

    cursor = connection.cursor()
    sql = "SELECT * FROM Users WHERE phone_number = %s AND password = %s"
    val = (user_data.phone_number, user_data.password)
    cursor.execute(sql, val)
    user = cursor.fetchone()

    if not user:
        error_msg = "Неверный номер телефона или пароль"
        raise HTTPException(status_code=400, detail=error_msg)


    user_id = user[0]
    print("Успешный вход, пользователь найден")

    # Возвращаем user_id в ответе
    return {"message": "Успешный вход, пользователь найден", "user_id": user_id}


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


#
@app.put("/users/{user_id}")
def update_user(user_id: int, user_data: user_reg_log):
    cursor = connection.cursor()
    update_query = "UPDATE users SET "
    update_values = []
    if user_data.password and len(user_data.password) < 8:
        return {"status": "error", "message": "Длина пароля менее 8 символов"}
    if user_data.password:
        update_query += "password = %s, "
        update_values.append(user_data.password)
    if user_data.email:
        update_query += "email = %s, "
        update_values.append(user_data.email)
    if user_data.name:
        update_query += "name = %s, "
        update_values.append(user_data.name)
    if user_data.surname:
        update_query += "surname = %s, "
        update_values.append(user_data.surname)
    if user_data.about_me:
        update_query += "about_me = %s, "
        update_values.append(user_data.about_me)
    if user_data.photo:
        photo_bytes = base64.b64decode(user_data.photo)
        update_values.append(photo_bytes)
        update_query += "photo = %s, "

    # Убираем последнюю запятую и пробел
    update_query = update_query[:-2]

    # Добавляем условие по user_id
    update_query += " WHERE user_id = %s"
    update_values.append(user_id)

    cursor.execute(update_query, tuple(update_values))

    connection.commit()
    return {
        "status": "success",
        "message": f"Пользователь с id:{user_id} успешно обновил информацию о себе",
    }


# -----------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------------
# ---------------------------------------ТАБЛИЦА NOTES-------------------------------------------
# -----------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------------
@app.post("/notes/create")
def create_note(note: NoteCreate):
    cursor = connection.cursor()

    # Получение значений title и text из таблицы NoteTemplates, если указан template_id
    if note.template_id is not None:
        sql = "SELECT template_text FROM NoteTemplates WHERE template_id = %s"
        val = (note.template_id,)
        cursor.execute(sql, val)
        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="Шаблон не найден!!!")
        template_text = result[0]
    else:
        template_text = None

    # пихаем данные в таблицу notes
    sql = "INSERT INTO Notes (user_id, template_id, title, text, created_at) VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)"
    val = (
        note.user_id,
        note.template_id,
        note.title,
        note.text if template_text is None else template_text,
    )
    cursor.execute(sql, val)
    connection.commit()

    return {"status": "success", "message": "Заметка создана!"}


# Удалить заметку по ID
@app.delete("/notes/{id}")
def delete_notes_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM notes WHERE note_id = {id}")
    result = cursor.fetchone()
    if result:
        cursor.execute(f"DELETE FROM notes WHERE note_id = {id}")
        connection.commit()
        return {"message": "Заметка удалена"}
    else:
        return {"message": "такой заметки нет"}


# Получить информацию о замеке по ID
@app.get("/notes/{id}")
def get_notes_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM notes WHERE note_id = {id}")
    result1 = (
        cursor.fetchone()
    )  # возвращает следующую строку результата запроса как кортеж
    return {"Note": result1}


# Получить список заметок пользователя
@app.get("/notes/user/{user_id}")
async def get_user_notes(user_id: int):
    cursor = connection.cursor()

    sql = "SELECT * FROM Notes WHERE user_id = %s"
    val = (user_id,)
    cursor.execute(sql, val)
    result = cursor.fetchall()

    notes = []
    for row in result:
        note = {
            "note_id": row[0],
            "user_id": row[1],
            "template_id": row[2],
            "title": row[3],
            "text": row[4],
            "created_at": row[5],
        }
        notes.append(note)

    return {"status": "success", "notes": notes}


# обновляем инфу о заметке
@app.put("/notes/{note_id}")
def update_user(note_id: int, note_data: NoteCreate):
    cursor = connection.cursor()

    # Получение значений title и text из таблицы NoteTemplates, если указан template_id
    if note_data.template_id is not None:
        sql = "SELECT template_text FROM NoteTemplates WHERE template_id = %s"
        val = (note_data.template_id,)
        cursor.execute(sql, val)
        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="Шаблон не найдена")
        template_text = result[0]
    else:
        template_text = None

    update_query = "UPDATE notes SET "
    update_values = []
    if note_data.text:
        update_query += "text = %s, "
        update_values.append(note_data.text if template_text is None else template_text)
    if note_data.title:
        update_query += "title = %s, "
        update_values.append(note_data.title)
    update_query = update_query[:-2]

    update_query += " WHERE note_id = %s"
    update_values.append(note_id)

    cursor.execute(update_query, tuple(update_values))

    connection.commit()
    return {
        "status": "success",
        "message": f" Заметка с id:{note_id} успешно обновил информацию о себе",
    }


# -----------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------------
# -------------------------------ТАБЛИЦА NoteTemplates-------------------------------------------
# -----------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------------
# Получить все шаблоны
@app.get("/NoteTemplates")
def get_NoteTemplates():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM NoteTemplates")
    result = cursor.fetchall()  # возвращаем все строки в виде списка
    cursor.close()
    return {"NoteTemplates": result}


# Получить шаблон
@app.get("/NoteTemplates/{id}")
def get_NoteTemplates_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM NoteTemplates WHERE template_id = {id}")
    result1 = (
        cursor.fetchone()
    )  # возвращает следующую строку результата запроса как кортеж
    return {"NoteTemplate": result1}


# добавление нового шаблона
@app.post("/NoteTemplates")
def regis_new_NoteTemplates(note_Tem: notes_tem):
    cursor = connection.cursor()
    # есть ли такой пользователь?
    note_look = "SELECT * FROM NoteTemplates WHERE template_text = %s"
    note_data_ch = note_Tem.template_text
    cursor.execute(note_look, note_data_ch)
    answer = cursor.fetchone()

    if answer:
        return {"message": "Такой шаблон уже есть!)"}
    sql = "INSERT INTO NoteTemplates (template_name,template_text) VALUES (%s, %s)"
    val = (note_Tem.template_name, note_Tem.template_text)
    cursor.execute(sql, val)
    connection.commit()
    return {"message": "Шаблон добавлен!"}


# обновление шаблона
@app.put("/NoteTemplates/{template_id}")
def update_NoteTemplates(template_id: int, note_Tem: notes_tem):
    cursor = connection.cursor()
    update_query = "UPDATE NoteTemplates SET "
    update_values = []

    if note_Tem.template_text:
        update_query += "template_text = %s, "
        update_values.append(note_Tem.template_text)
    if note_Tem.template_name:
        update_query += "template_name = %s, "
        update_values.append(note_Tem.template_name)
    # Убираем последнюю запятую и пробел
    update_query = update_query[:-2]

    # Добавляем условие по user_id
    update_query += " WHERE template_id = %s"
    update_values.append(template_id)

    cursor.execute(update_query, tuple(update_values))

    connection.commit()
    return {
        "status": "success",
        "message": f"Шаблон с id:{template_id} успешно обновил информацию о себе",
    }


# удалить шаблон
@app.delete("/NoteTemplates/{id}")
def delete_NoteTemplates_by_id(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM NoteTemplates WHERE template_id = {id}")
    result = cursor.fetchone()
    if result:
        cursor.execute(f"DELETE FROM NoteTemplates WHERE template_id = {id}")
        connection.commit()
        return {"message": "Шаблон удалён >:)"}
    else:
        return {"message": "Шаблон не найден"}
