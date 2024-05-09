// ОТОБРАЖАЕМ ЗАМЕТКИ ПОЛЬЗОВАТЕЛЯ
const notesContainer = document.querySelector('.note-container');
const closeBtn = document.getElementById("closeBtn");
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
            titleContainer.style.overflow = 'hidden';
            titleContainer.style.textOverflow = 'ellipsis';
            titleContainer.style.whiteSpace = 'nowrap';
            titleContainer.style.width = '100%';
            const noteTitle = document.createTextNode(note.title);
            titleContainer.appendChild(noteTitle);
            noteElement.appendChild(titleContainer);
            const noteText = document.createElement('p');
            noteText.classList.add('note-text');
            noteText.textContent = note.text;
            noteElement.appendChild(noteText);
            notesContainer.appendChild(noteElement);

            noteElement.addEventListener('click', (event) => {
                const modal = document.getElementById("myModal");
                modal.style.display = "block";
                //получаем идентификатор
                const noteId = event.target.getAttribute('data-id');
                //получаем инф о заметке
                const zapross = new XMLHttpRequest();
                zapross.open('GET', `/notes/${noteId}`);
                zapross.onload = function () {
                    if (zapross.status === 200) {
                        const response = JSON.parse(zapross.responseText);
                        const note = response.Note;

                        //по сути глобальная переменная для отображения
                        window.currentNote = note;
                    }
                };
                zapross.send();
            });
        });
    }
};
get_zapross.send();

deleteBtn.onclick = function () {
    const currentNote = window.currentNote;
    const get_zapross = new XMLHttpRequest();
    get_zapross.open('DELETE', `/notes/${currentNote.note_id}`);
    get_zapross.onload = function () {
        if (get_zapross.status === 200) {
            const response = JSON.parse(get_zapross.responseText);

            // удаляем заметку из note-container
            const noteContainer = document.querySelector('.note-container');
            const noteElements = noteContainer.querySelectorAll('.note');
            noteElements.forEach((element) => {
                if (element.getAttribute('data-id') === currentNote.note_id) {
                    noteContainer.removeChild(element);
                }
            });

            // закрываем модальное окно
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
        }
    };
    get_zapross.send();
};

openBtn.onclick = function () {
    const currentNote = window.currentNote;
    window.location.href = `redak.html?note_id=${currentNote.note_id}`;
};
closeBtn.onclick = function () {
    modal.style.display = "none";
};
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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