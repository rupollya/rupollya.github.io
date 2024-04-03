const notesContainer = document.querySelector('.note-container');
const notes = JSON.parse(localStorage.getItem('notes')) || [];
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

const openBtn = document.getElementById("openNote");
const deleteBtn = document.getElementById("deleteNote");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function () {
    modal.style.display = "none";
};
deleteBtn.onclick = function () {
    const currentNote = JSON.parse(localStorage.getItem('currentNote'));
    const noteIndex = notes.findIndex((note) => note.title === currentNote.title);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(notes));

        //удаление удаленной заметки из note-container
        const noteContainer = document.querySelector('.note-container');
        const noteElements = noteContainer.querySelectorAll('.note');
        noteElements.forEach((element) => {
            if (element.innerText === currentNote.title) {
                noteContainer.removeChild(element);
            }
        });

        modal.style.display = "none";
    }
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

    let notes = JSON.parse(localStorage.getItem('notes'));

    switch (sortBy) {//сортировка заметок
        case '1':
            notes.sort((a, b) => a.data - b.data); //сортировка от старых к новым
            break;
        case '2':
            notes.sort((a, b) => b.data - a.data); //сортировка от новых к старым
            break;
        case '3':
            notes.sort((a, b) => a.title.localeCompare(b.title)); //сортировка от А к Я
            break;
        case '4':
            notes.sort((a, b) => b.title.localeCompare(a.title)); //сортировка от Я к А
            break;
        case '5':
            notes.sort((a, b) => a.data - b.data); //сортировка от старых к новым
            break;
    }

    localStorage.setItem('notes', JSON.stringify(notes));//Обновление localStorage с отсортированными заметками
    window.location.reload();
}



//ПРОФИЛЬ
function saveProfile() {
    const nickname = document.querySelector('.nikname').value;
    const email = document.querySelector('.pochta').value;
    const info = document.querySelector('.info').value;

    localStorage.setItem('nickname', nickname);
    localStorage.setItem('email', email);
    localStorage.setItem('info', info);
    $('#modal_prof').modal('hide');
}
//ВОССТАНАВЛИВАЮ ДАННЫЕ ДЛЯ АПРОФИЛЯ
window.onload = function () {
    const nickname = localStorage.getItem('nickname');
    const email = localStorage.getItem('email');
    const info = localStorage.getItem('info');

    document.querySelector('.nikname').value = nickname;
    document.querySelector('.pochta').value = email;
    document.querySelector('.info').value = info;
}