document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.querySelector('.btn.savebutton');
    const inputName = document.getElementById('name');
    const noteContent = document.getElementById('note');

    async function saveNote() {
        const title = inputName.value.trim();
        const text = noteContent.innerHTML.trim();
        const userId = localStorage.getItem('user_id');

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
                    alert('Заметка сохранена!');
                    // Очистка полей ввода и переход на основную страницу
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
        } else {
            alert('Пожалуйста, заполните название и текст заметки.');
        }
    }

    saveButton.addEventListener('click', saveNote);
});
//получаем содержимое заметки либо при создании новой либо при переходе вставки текста
document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);

    const noteId = urlParams.get('noteId');
    const title = decodeURIComponent(urlParams.get('title'));
    const text = decodeURIComponent(urlParams.get('text'));
    const textarea = document.querySelector('.modal-note-textarea');

    if (noteId) {
        document.getElementById('name').value = title;
        textarea.innerHTML = text;
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
                alert('Заметка удалена!');
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
