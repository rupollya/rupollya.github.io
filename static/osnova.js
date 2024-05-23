// ОТОБРАЖАЕМ ЗАМЕТКИ ПОЛЬЗОВАТЕЛЯ
const notesContainer = document.querySelector('.note-container');
const get_zapross = new XMLHttpRequest();

const user_id = localStorage.getItem('user_id');

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


            //структура заметки
            titleContainer.style.overflow = 'hidden';
            titleContainer.style.textOverflow = 'ellipsis';
            titleContainer.style.whiteSpace = 'nowrap';
            titleContainer.style.width = '100%';
            //получаем айди текст и титл
            const noteTitle = document.createTextNode(note.title);
            //const notetext = document.createTextNode(note.text);
            //const note_id = document.createTextNode(note.note_id);
            //устанавливаем атрибуты
            noteElement.setAttribute('note_id', note.note_id);//по сути находим Id
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('text', note.text);
            titleContainer.appendChild(noteTitle);//отображаем титл
            //titleContainer.appendChild(note_id);  отображается id корректно
            noteElement.appendChild(titleContainer);
            const noteText = document.createElement('p');

            notesContainer.appendChild(noteElement);
            noteElement.addEventListener('click', (event) => {
                const noteId = event.currentTarget.getAttribute('note_id');
                const title = event.currentTarget.getAttribute('title');
                const text = event.currentTarget.getAttribute('text');
                // Получаем информацию о заметке по идентификатору
                const zapross = new XMLHttpRequest();
                zapross.open('GET', `/notes/${noteId}`);
                zapross.onload = function () {
                    if (zapross.status === 200) {
                        const response = JSON.parse(zapross.responseText);
                        const note = response.Note;

                        // Перенаправляем пользователя на страницу redak.html с параметром URL, содержащим информацию о заметке
                        window.location.href = `redak.html?noteId=${noteId}&title=${title}&text=${text}`;
                    }
                };
                zapross.send();
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
//СОРТИРОВКА!!!
const sortButtons = document.querySelectorAll('.dropdown-item');
sortButtons.forEach(btn => {
    btn.addEventListener('click', sortNotes);
});

function sortNotes(e) {
    const sortBy = e.target.dataset.sort;

    switch (sortBy) {
        case '1':
            notes.sort((a, b) => new Date(a.date) - new Date(b.date)); // сортировка от старых к новым
            break;
        case '2':
            notes.sort((a, b) => new Date(b.date) - new Date(a.date)); // сортировка от новых к старым
            break;
        case '3':
            notes.sort((a, b) => a.title.localeCompare(b.title)); // сортировка от А к Я
            break;
        case '4':
            notes.sort((a, b) => b.title.localeCompare(a.title)); // сортировка от Я к А
            break;
        case '5':
            notes.sort((a, b) => new Date(a.date) - new Date(b.date)); // сортировка от старых к новым
            break;
    }

    // Обновляем отображение заметок после сортировки
    displayNotes(notes);
}


//////////////////////поиск
////////////////////// ПОИСК
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
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
});
