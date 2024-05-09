//вставка информации

// Вставка информации при открытии модального окна
const modalProf = document.getElementById('modal_prof');
modalProf.addEventListener('show.bs.modal', (event) => {
  const user_id = localStorage.getItem('user_id'); // Получаем id из localStorage
  const update_zapross = new XMLHttpRequest();
  update_zapross.open('GET', `/users/${user_id}`); // Используйте GET для получения данных
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
      } else {
        alert(data.message);
      }
    } else {
      alert('Произошла ошибка при получении информации о пользователе');
    }
  };
  update_zapross.send();
});

const saveProfileButton = document.getElementById('saveButton');
saveProfileButton.addEventListener('click', async () => {
  const user_id = localStorage.getItem('user_id');
  const imagePreview = document.getElementById('imagePreview');

  // Получение других данных профиля
  const name = document.querySelector('.name').value;
  const surname = document.querySelector('.surname').value;
  const email = document.querySelector('.pochta').value;
  const about_me = document.querySelector('.info').value;
  const phone = document.querySelector('.phone').value;
  const password = document.querySelector('.password').value;

  // Создание объекта userData
  const userData = {
    name,
    surname,
    email,
    about_me,
    phone,
    password,
    photo: '' // Поле для Base64 строки изображения
  };

  // Загрузка изображения профиля
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput); // Добавляем элемент в DOM

  fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.style.backgroundImage = `url(${e.target.result})`;
        userData.photo = e.target.result.split(',')[1]; // Добавление Base64 строки в userData
      }

      reader.readAsDataURL(fileInput.files[0]);
    }
  });

  fileInput.click(); // Имитация клика для открытия диалога выбора файла

  // Отправка запроса на сервер
  const response = await fetch(`/users/${user_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json(); // Парсинг ответа сервера

  // Обработка ответа сервера
  if (data.status === 'success') {
    alert('Информация о профиле успешно обновлена');
  } else {
    alert(data.message);
  }
});
