
const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
};
 
// Функция получения куки
const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};




// ОТОБРАЖАЕМ ЗАМЕТКИ ПОЛЬЗОВАТЕЛЯ
const notesContainer = document.querySelector('.note-container');
const get_zapross = new XMLHttpRequest();
//const user_id = localStorage.getItem('user_id');
const user_id = getCookie('user_id');
get_zapross.open('GET', `/notes/user/${user_id}`);
get_zapross.onload = function () {
    if (get_zapross.status === 200) {
        const response = JSON.parse(get_zapross.responseText);
        const notes = response.notes;

        // выводим заметки
        notes.forEach((note) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');

            const noteImage = document.createElement('img');
            noteImage.classList.add('note-image');
            noteImage.src = "https://i.postimg.cc/ZqXk67H1/note.png";
            noteElement.appendChild(noteImage);

            const titleContainer = document.createElement('div');
            // структура заметки
            titleContainer.style.overflow = 'hidden';
            titleContainer.style.textOverflow = 'ellipsis';
            titleContainer.style.whiteSpace = 'nowrap';
            titleContainer.style.width = '100%';

            // получаем ID, текст и титл
            const noteTitle = document.createTextNode(note.title);

            // устанавливаем атрибуты
            noteElement.setAttribute('note_id', note.note_id);
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('text', note.text);
            titleContainer.appendChild(noteTitle);
            noteElement.appendChild(titleContainer);

            notesContainer.appendChild(noteElement);
            noteElement.addEventListener('click', (event) => {
                const noteId = event.currentTarget.getAttribute('note_id');
                
                window.location.href = `redak.html?noteId=${noteId}`;
            });
        });
    }
};
get_zapross.send();
//создааем новую заметку!!
function createNewNote() {//очистка локалсторадж перед переходом для создания
    window.location.href = 'redak.html';
}

//window.onclick = function (event) {
//   if (event.target === modal) {
//       modal.style.display = "none";
//   }
//};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ФИЛЬТРАЦИЯ
const filterInput = document.getElementById('filter-input');
const notesContainerr = document.querySelector('.note-container');
const user_idd = localStorage.getItem('user_id');
// Функция для отображения заметок
function displayNotes(notes) {
    notes.forEach((note) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        notesContainerr.appendChild(noteElement);
        noteElement.addEventListener('click', (event) => {
        });
    });
}
//скрываем заметки
function hidenotes(value) {
    notesContainerr.querySelectorAll('.note').forEach((note) => {
        const title = note.querySelector('div').textContent.toLowerCase();
        if (title.includes(value)) {
            note.style.display = 'block'; // подходит
        } else {
            note.style.display = 'none'; // неподходит
        }
    });

}

//если я нажала на применить -> скрываем лишнее
document.querySelector('#exampleModal form').addEventListener('submit', function (event) {
    event.preventDefault();

    const filterValue = filterInput.value.toLowerCase();
    hidenotes(filterValue);
});
//отмена
const filterInputt = document.getElementById('filter-input');
const notesContainerrr = document.querySelector('.note-container');
const resetButton = document.querySelector('.resetbtn');
resetButton.addEventListener('click', function () {
    filterInputt.value = '';
    notesContainerrr.querySelectorAll('.note').forEach((note) => {
        note.style.display = '';
    });
});


////////////////////// ПОИСК
const searchInput = document.getElementById('searchInput');
let timeoutId;
searchInput.addEventListener('input', function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        notesContainer.innerHTML = '';

        const get_zapross = new XMLHttpRequest();
        get_zapross.open('GET', `/notes/user/${user_id}`);
        get_zapross.onload = function () {
            if (get_zapross.status === 200) {
                const response = JSON.parse(get_zapross.responseText);
                const notes = response.notes;

                //вот тут фильтрую заметки относительно введеного мною текста
                const filteredNotes = notes.filter(note => note.text.toLowerCase().includes(searchTerm));

                filteredNotes.forEach(note => {
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note');

                    const noteImage = document.createElement('img');
                    noteImage.classList.add('note-image');
                    noteImage.src = "https://i.postimg.cc/ZqXk67H1/note.png";
                    noteElement.appendChild(noteImage);

                    const titleContainer = document.createElement('div');
                    titleContainer.style.overflow = 'hidden';
                    titleContainer.style.textOverflow = 'ellipsis';
                    titleContainer.style.whiteSpace = 'nowrap';
                    titleContainer.style.width = '100%';

                    const noteTitle = document.createTextNode(note.title);
                    titleContainer.appendChild(noteTitle);
                    noteElement.appendChild(titleContainer);

                    noteElement.setAttribute('note_id', note.note_id);
                    noteElement.setAttribute('title', note.title);
                    noteElement.setAttribute('text', note.text);

                    notesContainer.appendChild(noteElement);

                    noteElement.addEventListener('click', (event) => {
                        const noteId = event.currentTarget.getAttribute('note_id');
                        const title = event.currentTarget.getAttribute('title');
                        const text = event.currentTarget.getAttribute('text');
                        const zapross = new XMLHttpRequest();
                        zapross.open('GET', `/notes/${noteId}`);
                        zapross.onload = function () {
                            if (zapross.status === 200) {
                                const response = JSON.parse(zapross.responseText);
                                const note = response.Note;
                                window.location.href = `redak.html?noteId=${noteId}&title=${title}&text=${text}`;
                            }
                        };
                        zapross.send();
                    });
                });
            }
        };
        get_zapross.send();
    }, 500);
});






 