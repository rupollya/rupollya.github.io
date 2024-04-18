//добавка в пользователя
function updateUserDataInLocalStorage(phone, phone1, password, info, email, name, surname, backgroundImage) {
    const userKey = 'user' + '+' + phone;
    let userData = JSON.parse(localStorage.getItem(userKey));
    if (userData) {
        // Создаем новый ключ с новым номером телефона
        const newUserKey = 'user' + '+' + phone1;

        // Удаляем старый ключ, если он не равен новому ключу
        if (userKey !== newUserKey) {
            localStorage.removeItem(userKey);
        }

        // Обновляем данные пользователя
        userData.info = info;
        userData.surname = surname;
        userData.name = name;
        userData.email = email;
        userData.image = backgroundImage;
        userData.phone = phone1;
        userData.password = password;

        // Сохраняем данные пользователя по новому ключу
        localStorage.setItem(newUserKey, JSON.stringify(userData));
    }
}
//ПРОФИЛЬ
window.onload = function () {

    var currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    // Заполнение полей формы данными из currentUser
    document.querySelector('.name').value = currentUser.name || '';
    document.querySelector('.surname').value = currentUser.surname || '';
    document.querySelector('.pochta').value = currentUser.email || '';
    document.querySelector('.info').value = currentUser.info || ''
    document.querySelector('.phone').value = currentUser.phone || ''
    document.querySelector('.password').value = currentUser.password || ''

    //восстановление изображения профиля
    // Восстановление изображения профиля из currentUser
    var savedImage = currentUser.image;
    if (savedImage) {
        var imagePreview = document.getElementById('imagePreview');
        imagePreview.style.backgroundImage = savedImage;
        imagePreview.innerText = '';
    }

    //при клике на квадрат
    var imagePreview = document.getElementById('imagePreview');
    imagePreview.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                //показываем изображение в квадрате
                imagePreview.style.backgroundImage = "url('" + reader.result + "')";
                imagePreview.innerText = ''; //убираем текст

            }
            reader.readAsDataURL(file);
        }
        input.click();
    });
}

function saveProfile() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        currentUser = {
            phone: userData.phone, // Получаем номер телефона текущего пользователя
            phone: userData.phone,
            surname: null,
            name: null
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

    }

    // Сохранение данных профиля
    const name = document.querySelector('.name').value;
    const surname = document.querySelector('.surname').value;
    const email = document.querySelector('.pochta').value;
    const info = document.querySelector('.info').value;
    const phone = currentUser.phone;


    const phone1 = document.querySelector('.phone').value;
    const password = document.querySelector('.password').value;

    currentUser.name = name;
    currentUser.surname = surname;
    currentUser.email = email;
    currentUser.info = info;
    currentUser.phone = phone1;
    currentUser.password = password;

    var imagePreview = document.getElementById('imagePreview');
    var backgroundImage = imagePreview.style.backgroundImage;
    currentUser.image = backgroundImage;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    updateUserDataInLocalStorage(phone, phone1, password, info, email, name, surname, backgroundImage);
    //localStorage.setItem('name', name);
    //localStorage.setItem('surname', surname);
    //localStorage.setItem('email', email);
    //localStorage.setItem('info', info);

    // Получаем выбранное изображение из предварительного просмотра


    // Сохраняем URL изображения в локальное хранилище
    //localStorage.setItem('image', backgroundImage);

    $('#modal_prof').modal('hide');
}
//актив не актив кнопка
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    const phoneInput = document.querySelector('.phone');
    const passwordInput = document.querySelector('.password');
    phoneInput.addEventListener('input', function() {
        if (phoneInput.value.length < 11) {
            saveButton.disabled = true; // Делаем кнопку неактивной
        } else {
            saveButton.disabled = false; // Делаем кнопку активной
        }
    });
    passwordInput.addEventListener('input', function() {
        if (passwordInput.value.length < 8) {
            saveButton.disabled = true; // Делаем кнопку неактивной
        } else {
            saveButton.disabled = false; // Делаем кнопку активной
        }
    });
});

