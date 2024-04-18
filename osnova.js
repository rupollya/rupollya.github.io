const notesContainer = document.querySelector('.note-container');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Проверяем, что currentUser существует и у него есть заметки
if (currentUser && currentUser.notes) {
    // Используем заметки текущего пользователя для отображения
    const notes = currentUser.notes;

    notes.forEach((note, index) => {
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
        notesContainer.appendChild(noteElement);

        noteElement.addEventListener('click', (event) => {
            const modal = document.getElementById("myModal");
            modal.style.display = "block";
            localStorage.setItem('currentNote', JSON.stringify(note));
        });
    });
}
const openBtn = document.getElementById("openNote");
const deleteBtn = document.getElementById("deleteNote");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function () {
    modal.style.display = "none";
};
deleteBtn.onclick = function () {
    const currentNote = JSON.parse(localStorage.getItem('currentNote'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Удаляем заметку из массива заметок текущего пользователя
    const noteIndex = currentUser.notes.findIndex((note) => note.title === currentNote.title);
    if (noteIndex !== -1) {
        currentUser.notes.splice(noteIndex, 1);

        // Сохраняем обновленные данные текущего пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Удаляем заметку из массива заметок пользователя в localStorage
    const userKey = 'user+' + currentUser.phone;
    const userData = JSON.parse(localStorage.getItem(userKey));
    const userNoteIndex = userData.notes.findIndex((note) => note.title === currentNote.title);
    if (userNoteIndex !== -1) {
        userData.notes.splice(userNoteIndex, 1);
        localStorage.setItem(userKey, JSON.stringify(userData));
    }

    // Удаление удаленной заметки из note-container
    const noteContainer = document.querySelector('.note-container');
    const noteElements = noteContainer.querySelectorAll('.note');
    noteElements.forEach((element) => {
        if (element.innerText === currentNote.title) {
            noteContainer.removeChild(element);
        }
    });

    modal.style.display = "none";
};


openBtn.onclick = function () {//открываем заметку  
    modal.style.display = "none";
    window.location.href = 'redak.html';
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function createNewNote() {//очистка локалсторадж перед переходом для создания
    localStorage.removeItem('currentNote');
    window.location.href = 'redak.html';
}
//ФИЛЬТРАЦИЯ
const filterInput = document.getElementById('filter-input');//получаем поле ввода для фильтрации
const notess = document.querySelectorAll('.note');//получаем все заметки
document.querySelector('#exampleModal form').addEventListener('submit', function (event) {
    event.preventDefault();

    const filterValue = filterInput.value.toLowerCase(); //получаем значение фильтра

    // Проходим по каждой заметке и проверяем заголовок
    notess.forEach(note => {
        const title = note.querySelector('div').textContent.toLowerCase(); //получаем заголовок


        if (!title.includes(filterValue)) { //если заголовок не содержит введенное значение, скрываем заметку, иначе показываем
            note.style.display = 'none';
        } else {
            note.style.display = 'block';
        }
    });
});
document.querySelector('#exampleModal form').addEventListener('reset', function (event) {

    notess.forEach(note => {//проходим по каждой заметке и показываем их
        if (note.style.display === 'none') {
            note.style.display = 'block';
        }
    });

    filterInput.value = '';//очищаем поле ввода фильтра
});
//СОРТИРОВКА!!!
const sortButtons = document.querySelectorAll('.dropdown-item');
sortButtons.forEach(btn => {
    btn.addEventListener('click', sortNotes);
});

function sortNotes(e) {
    const sortBy = e.target.dataset.sort;

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Получаем массив заметок текущего пользователя
    let userNotes = currentUser.notes;

    // Применяем логику сортировки, аналогичную той, что используется для основного массива заметок
    switch (sortBy) {
        case '1':
            userNotes.sort((a, b) => a.data - b.data); // сортировка от старых к новым
            break;
        case '2':
            userNotes.sort((a, b) => b.data - a.data); // сортировка от новых к старым
            break;
        case '3':
            userNotes.sort((a, b) => a.title.localeCompare(b.title)); // сортировка от А к Я
            break;
        case '4':
            userNotes.sort((a, b) => b.title.localeCompare(a.title)); // сортировка от Я к А
            break;
        case '5':
            userNotes.sort((a, b) => a.data - b.data); // сортировка от старых к новым
            break;
    }
    currentUser.notes = userNotes;

    // Обновляем данные текущего пользователя в localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.reload();
}


//////////////////////поиск
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    notesContainer.innerHTML = '';

    // Фильтруем заметки текущего пользователя в соответствии с поисковым запросом
    const filteredNotes = currentUser.notes.filter(note => {
        return note.text.toLowerCase().includes(searchTerm);//note.title.toLowerCase().includes(searchTerm) ||
    });

    // Отображаем отфильтрованные заметки
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
        notesContainer.appendChild(noteElement);

        noteElement.addEventListener('click', (event) => {
            const modal = document.getElementById("myModal");
            modal.style.display = "block";
            localStorage.setItem('currentNote', JSON.stringify(note));
        });
    });
});