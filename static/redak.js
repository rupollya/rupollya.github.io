document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.querySelector('.btn.savebutton');
    const inputName = document.getElementById('name');
    const noteContent = document.getElementById('note');

    async function saveNote() {
        const title = inputName.value.trim();
        const text = noteContent.innerHTML.trim();
        const userId = getCookie('user_id');


        if (title && text) {
            const noteData = {
                title: title,
                text: text
            };

            const urlParams = new URLSearchParams(window.location.search);
            const noteId = urlParams.get('noteId');

            let endpoint = '/notes/create';
            let method = 'POST';
            if (noteId) {
                endpoint = `/notes/${noteId}`;
                method = 'PUT';
            } else {
                noteData.user_id = userId;
            }

            try {
                const response = await fetch(endpoint, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(noteData)
                });

                const result = await response.json();

                if (result.status === 'success') {

                    inputName.value = '';
                    noteContent.textContent = '';
                    window.location.href = 'osnova.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Ошибка при сохранении заметки:', error);
                alert('Произошла ошибка при сохранении заметки.');
            }
        }
    }

    saveButton.addEventListener('click', saveNote);
});
//получаем содержимое заметки либо при создании новой либо при переходе вставки текста

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('noteId');
    const textarea = document.querySelector('.modal-note-textarea');

    if (noteId) {
        const getNoteRequest = new XMLHttpRequest();
        getNoteRequest.open('GET', `/notes/${noteId}`);
        getNoteRequest.onload = function () {
            if (getNoteRequest.status === 200) {
                const response = JSON.parse(getNoteRequest.responseText);
                console.log(response); // Отладочное сообщение


                if (response.status === 'success') {
                    const note = response.data;
                    document.getElementById('name').value = note.title;
                    textarea.innerHTML = note.text;
                } else {
                    console.error('Ошибка: Заметка не найдена.');
                }
            } else {
                console.error('Ошибка при загрузке данных заметки.');
            }
        };
        getNoteRequest.send();
    } else {
        textarea.setAttribute('data-placeholder', 'Начни свою заметку!');
        textarea.innerText = '';
    }
});
//удаление заметки
document.addEventListener('DOMContentLoaded', function () {
    const deleteBtn = document.querySelector('.btn.deletebutton');
    deleteBtn.onclick = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('noteId');
        const currentNote = window.currentNote;
        const get_zapross = new XMLHttpRequest();
        get_zapross.open('DELETE', `/notes/${noteId}`);
        get_zapross.onload = function () {

            if (get_zapross.status === 200) {

                window.location.href = 'osnova.html';
            } else {
                alert(result.message);
            }
        };
        get_zapross.send();
    };
});


//микрофон
document.querySelector('.button_image.micro').addEventListener('click', function () {
    let timeout;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.start();

    recognition.onstart = function () {
        window.clearTimeout(timeout);
    };

    recognition.onresult = function (event) {
        const my_text = event.results[0][0].transcript;
        document.querySelector('.modal-note-textarea').innerHTML += my_text;//document.querySelector('.modal-note-textarea').value += my_text;

        timeout = setTimeout(function () {
            recognition.stop();
        }, 2000); // Таймаут
    };
});

//функция применения стиля к выделенному тексту
function applyStyle(style) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var frag = range.extractContents();
        var span = document.createElement("span");
        for (var a in style) {
            span.style[a] = style[a];
        }
        span.appendChild(frag);
        range.insertNode(span);
    }
}


//функция изменения размера шрифта
function changeFontSize(fontSize) {
    event.preventDefault();
    applyStyle({ 'fontSize': fontSize + 'px', 'fontFamily': getFontFamily() });
}

//функция изменения цвета шрифта
function changeColor(color) {
    event.preventDefault();
    applyStyle({ 'color': color, 'fontFamily': getFontFamily() });
}

//функция изменения семейства шрифта
function changeFontFamily(fontFamily) {
    event.preventDefault();
    applyStyle({ 'fontFamily': fontFamily });
}

//функция получения текущего семейства шрифта
function getFontFamily() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var span = range.commonAncestorContainer.parentNode;
        return span.style.fontFamily;
    }
    return '';
}



//функция изменения стиля текста
function changeStil(styleType, value) {
    event.preventDefault();
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var style = {};
        style[styleType] = value;
        style['fontFamily'] = getFontFamily();
        applyStyle(style);
    }
}


function changeBACKColor(color) {
    event.preventDefault();
    applyStyle({ 'background-color': color, 'fontFamily': getFontFamily() });
}



const modalProf = document.getElementById('modal_prof');
modalProf.addEventListener('show.bs.modal', (event) => {
    const user_id = getCookie('user_id');
    const update_zapross = new XMLHttpRequest();
    update_zapross.open('GET', `/users/${user_id}`);
    update_zapross.onload = () => {
        if (update_zapross.status === 200) {
            const data = JSON.parse(update_zapross.responseText);
            if (data.status === 'success') {
                const user = data.data;

                modalProf.querySelector('.name').value = user.name;
                modalProf.querySelector('.surname').value = user.surname;
                modalProf.querySelector('.pochta').value = user.email;
                modalProf.querySelector('.info').value = user.about_me;
                modalProf.querySelector('.phone').value = user.phone_number;
                modalProf.querySelector('.password').value = user.password;

                // отображение фотографии пользователя 
                const imagePreview = document.getElementById('imagePreview');
                if (user.photo) {
                    //imagePreview.style.backgroundImage = url(`data:image/jpeg;base64,${user.photo}`);  
                    imagePreview.style.backgroundImage = `url(data:image/jpeg;base64,${user.photo})`;
                    // imagePreview.style.backgroundSize = 'cover';
                    imagePreview.style.backgroundRepeat = 'no-repeat';
                    imagePreview.style.backgroundSize = '100% 100%';
                    imagePreview.style.backgroundPosition = 'center';

                    imagePreview.innerHTML = ''; // убираем текст "Добавить фото" 
                }
            } else {
                alert(data.message);
            }
        } else {
            alert('Произошла ошибка при получении информации о пользователе');
        }
    };
    update_zapross.send();
});



// Функция получения куки
const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};
