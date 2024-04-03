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

        // Удаление удаленной заметки из note-container
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

openBtn.onclick = function () {// Открываем заметку  
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
const notess = document.querySelectorAll('.note');// Получаем все заметки
document.querySelector('#exampleModal form').addEventListener('submit', function (event) {// Добавляем обработчик события для кнопки "Применить"
    event.preventDefault(); // Предотвращаем отправку формы

    const filterValue = filterInput.value.toLowerCase(); // Получаем значение фильтра и приводим к нижнему регистру

    // Проходим по каждой заметке и проверяем заголовок
    notess.forEach(note => {
        const title = note.querySelector('div').textContent.toLowerCase(); // Получаем заголовок и приводим к нижнему регистру

        // Если заголовок не содержит введенное значение, скрываем заметку, иначе показываем
        if (!title.includes(filterValue)) {
            note.style.display = 'none';
        } else {
            note.style.display = 'block';
        }
    });
});
document.querySelector('#exampleModal form').addEventListener('reset', function (event) {
    // Проходим по каждой заметке и показываем их
    notess.forEach(note => {
        if (note.style.display === 'none') {
            note.style.display = 'block';
        }
    });
    // Очищаем поле ввода фильтра
    filterInput.value = '';
});
//СОРТИРОВКА!!!
const sortButtons = document.querySelectorAll('.dropdown-item');
sortButtons.forEach(btn => {
    btn.addEventListener('click', sortNotes);
});

function sortNotes(e) {
    const sortBy = e.target.dataset.sort;

    let notes = JSON.parse(localStorage.getItem('notes'));
    // Сортировка заметок
    switch (sortBy) {
        case '1':
            notes.sort((a, b) => a.data - b.data); // Сортировка от старых к новым
            break;
        case '2':
            notes.sort((a, b) => b.data - a.data); // Сортировка от новых к старым
            break;
        case '3':
            notes.sort((a, b) => a.title.localeCompare(b.title)); // Сортировка от А к Я
            break;
        case '4':
            notes.sort((a, b) => b.title.localeCompare(a.title)); // Сортировка от Я к А
            break;
        case '5':
            notes.sort((a, b) => a.data - b.data); // Сортировка от старых к новым
            break;
    }

    // Обновление localStorage с отсортированными заметками
    localStorage.setItem('notes', JSON.stringify(notes));

    // Перезагрузка страницы для отображения отсортированных заметок
    window.location.reload();
}



//ПРОФИЛЬ
function saveProfile() {
    // Получить введенные данные
    const nickname = document.querySelector('.nikname').value;
    const email = document.querySelector('.pochta').value;
    const info = document.querySelector('.info').value;

    // Сохранить данные в локальное хранилище
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('email', email);
    localStorage.setItem('info', info);

    // Закрыть модальное окно
    $('#modal_prof').modal('hide');
}

window.onload = function () {
    // Восстановить данные из локального хранилища
    const nickname = localStorage.getItem('nickname');
    const email = localStorage.getItem('email');
    const info = localStorage.getItem('info');

    // Вставить данные в поля ввода
    document.querySelector('.nikname').value = nickname;
    document.querySelector('.pochta').value = email;
    document.querySelector('.info').value = info;
}