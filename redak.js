//ааа
const textareaa = document.querySelector('.modal-note-textarea');
const input = document.getElementById('name');
const saveButtonn = document.querySelector('.savebutton');
saveButtonn.disabled = true;
function checkInputs() {
    const noteTitle = input.value.trim();
    const noteText = textareaa.innerText.trim();
    if (noteTitle && noteText) {
        saveButtonn.disabled = false;
    } else {
        saveButtonn.disabled = true;
    }
}

input.addEventListener('input', checkInputs);
textareaa.addEventListener('input', checkInputs);

saveButtonn.addEventListener('click', function () {
    const noteTitle = input.value.trim();
    const noteText = textareaa.innerHTML.trim();
    if (noteTitle && noteText) {
        const noteData = {
            title: noteTitle,
            text: noteText
        };
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        const existingNoteIndex = notes.findIndex(note => note.title === noteTitle);
        if (existingNoteIndex !== -1) {
            notes[existingNoteIndex] = noteData;
        } else {
            notes.push(noteData);
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        input.value = '';
        textareaa.innerHTML = ''; // Очищаем содержимое
        saveButtonn.disabled = true;
    } else {
        alert('Пожалуйста, заполните оба поля перед сохранением заметки.');
    }
});

//fff
const saveButton = document.getElementById('save-btn');
saveButton.disabled = true;
const textarea = document.querySelector('.modal-note-textarea');

saveButton.addEventListener('click', function () {
    const template_id = document.querySelector('.template-btn.active').getAttribute('nomer');
    const template_text = text_button(template_id);

    textarea.innerHTML = template_text;

    saveButton.disabled = true;
});

document.querySelectorAll('.template-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (this.hasAttribute('nomer')) {
            this.classList.add('active');
            saveButton.disabled = false;
        }
    });
});

function text_button(template_id) {
    switch (template_id) {
        case '1':
            return 'СПИСОК ФИЛЬМОВ НА КАНИКУЛЫ<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>';
        case '2':
            return 'СПИСОК ПРОДУКТОВ<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>';
        case '3':
            return 'СПИСОК ЗАДАНИЙ НА БЛИЖАЙШЕЕ ВРЕМЯ<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>';
        case '4':
            return 'СПИСОК ДЕЛ НА ДЕНЬ<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>';
        case '5':
            return '>>>>>>>>РАСПИСАНИЕ НА НЕДЕЛЮ<<<<<<<<<br>ПОНЕДЕЛЬНИК:<br>ВТОРНИК:<br>СРЕДА:<br>ЧЕТВЕРГ:<br>ПЯТНИЦА:<br>СУББОТА:<br>ВОСКРЕСЕНЬЕ:<br>побочные дела на неделе:';
        case '6':
            return '>>>>>>>>РАСПИСАНИЕ НА ДЕНЬ<<<<<<<<<br>Что мне нужно сделать с утра:<br>Что я хочу сделать днем:<br>Что нужно отложить до вечера:<br>Отбой в :';
        case '7':
            return '>>>>>>>>РАСПИСАНИЕ ЗАНЯТИЙ<<<<<<<<<br> <br>ПЕРВАЯ ПАРА:<br> <br>ВТОРАЯ ПАРА:<br> <br>ТРЕТЬЯ ПАРА:<br> <br>ЧЕТВЕРТАЯ ПАРА:<br> <br>ПЯТАЯ ПАРА:<br> <br>а может хватит........ :)';
        case '8':
            return '>>>>>>>>РАСПИСАНИЕ ДЕЛ НА МЕСЯЦ<<<<<<<<<br>1 ДЕНЬ:<br>2 ДЕНЬ:<br>3 ДЕНЬ:<br>4 ДЕНЬ:<br>5 ДЕНЬ:<br>6 ДЕНЬ:<br>7 ДЕНЬ:<br>8 ДЕНЬ:<br>9 ДЕНЬ:<br>10 ДЕНЬ:<br>11 ДЕНЬ:<br>12 ДЕНЬ:<br>13 ДЕНЬ:<br>14 ДЕНЬ:<br>15 ДЕНЬ:<br>16 ДЕНЬ:<br>17 ДЕНЬ:<br>18 ДЕНЬ:<br>19 ДЕНЬ:<br>20 ДЕНЬ:<br>21 ДЕНЬ:<br>22 ДЕНЬ:<br>23 ДЕНЬ:<br>24 ДЕНЬ:<br>25 ДЕНЬ:<br>26 ДЕНЬ:<br>27 ДЕНЬ:<br>28 ДЕНЬ:<br>29 ДЕНЬ:<br>30 ДЕНЬ:';
        case '9':
            return 'ПЛАН ПОЕЗДКИ НА:<br> <br>мой бюджет:<br> <br>маршрут по которому я буду ехать:<br> <br>на сколько дней:<br> <br>где именно я хочу побывать:<br> <br>Удачной поездки!';
        case '10':
            return 'РАСПРЕДЕЛЕНИЕ БЮДЖЕТА!!!!<br> <br>МОЙ ДОХОД:<br> <br>СКОЛЬКО Я ОБЫЧНО ТРАЧУ ЗА ( ):<br> <br>СКОЛЬКО Я ХОЧУ НАКОПИТЬ ЗА ( )<br> <br>НА ЧТО Я ТРАЧУ ДЕНЬГИ:<br> <br>';
        case '11':
            return 'ПЛАН СОБЫТИЯ<br> <br>название события:<br> <br>дата события:<br> <br>время:<br> <br>место:<br> <br>список гостей<br> <br>другие важные детали:';
        case '12':
            return 'ПЛАН ИЗУЧЕНИЯ НОВОЙ ТЕМЫ<br> <br>тема:<br> <br>ключевые понятия:<br> <br>вопросы:<br> <br>вопросы на которые я ответила:<br> <br>время потраченное на данную тему:<br> <br>к чему стоит вернуться позже';
        case '13':
            return 'СПИСОК (       )<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*<br>*';
        case '14':
            return 'СПИСОК (       )<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12';
        default:
            return '';
    }
}


//вставляем текст и имя со страницы редак
document.addEventListener('DOMContentLoaded', function () {
    const currentNote = JSON.parse(localStorage.getItem('currentNote'));
    if (currentNote) {
        document.getElementById('name').value = currentNote.title;
        document.querySelector('.modal-note-textarea').innerHTML = currentNote.text;
    }
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

// Функция применения стиля к выделенному тексту
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


// Функция изменения размера шрифта
function changeFontSize(fontSize) {
    event.preventDefault();
    applyStyle({ 'fontSize': fontSize + 'px', 'fontFamily': getFontFamily() });
}

// Функция изменения цвета шрифта
function changeColor(color) {
    event.preventDefault();
    applyStyle({ 'color': color, 'fontFamily': getFontFamily() });
}

// Функция изменения семейства шрифта
function changeFontFamily(fontFamily) {
    event.preventDefault();
    applyStyle({ 'fontFamily': fontFamily });
}

// Функция получения текущего семейства шрифта
function getFontFamily() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var span = range.commonAncestorContainer.parentNode;
        return span.style.fontFamily;
    }
    return '';
}


//
// Функция изменения стиля текста
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
