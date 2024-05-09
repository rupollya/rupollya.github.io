const modalProf = document.getElementById('modal_prof');
modalProf.addEventListener('show.bs.modal', (event) => {
  const user_id = localStorage.getItem('user_id'); // пока в ls
  const update_zapross = new XMLHttpRequest();
  update_zapross.open('GET', `/users/${user_id}`);
  update_zapross.onload = () => {
    if (update_zapross.status === 200) {
      const data = JSON.parse(update_zapross.responseText);
      if (data.status === 'success') {
        const user = data.data;

        // Обновление информации пользователя
        modalProf.querySelector('.name').value = user.name;
        modalProf.querySelector('.surname').value = user.surname;
        modalProf.querySelector('.pochta').value = user.email;
        modalProf.querySelector('.info').value = user.about_me;
        modalProf.querySelector('.phone').value = user.phone_number;
        modalProf.querySelector('.password').value = user.password;

        // Отображение фотографии пользователя
        const imagePreview = document.getElementById('imagePreview');
        if (user.photo) {
          // Преобразование двоичных данных в строку Base64
          const base64String = arrayBufferToBase64(user.photo.data);
          // Установка фотографии как фона для div
          imagePreview.style.backgroundImage = `url('data:image/jpeg;base64,${base64String}')`;
          // Удаление текста "Добавить фото"
          imagePreview.innerHTML = '';
        }
      } else {
        alert(data.message);
      }
    } else {
      alert('Произошла ошибка при получении информации о пользователе');
    }
  };
  update_zapross.send();
});

// Функция для преобразования ArrayBuffer в Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}



// Создание объекта userData
const userData = {
  name: '',
  surname: '',
  email: '',
  about_me: '',
  phone: '',
  password: '',
  photo: ''
};

// Создание и настройка элемента input для файла один раз
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none'; // Скрыть элемент input
document.body.appendChild(fileInput); // Добавляем элемент в DOM

// Обработчик события изменения файла, добавленный один раз
fileInput.addEventListener('change', function () {
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.style.backgroundImage = `url(${e.target.result})`;
      imagePreview.querySelector('b').style.display = 'none'; // Скрываем надпись "Добавить фото"
      userData.photo = e.target.result.split(',')[1]; // Добавление Base64 строки в userData
    }

    reader.readAsDataURL(fileInput.files[0]);
  }
});

// Обработчик клика для imagePreview
imagePreview.addEventListener('click', () => fileInput.click());

// Кнопка сохранения профиля
const saveProfileButton = document.getElementById('saveButton');
saveProfileButton.addEventListener('click', async () => {
  // Получение других данных профиля
  userData.name = document.querySelector('.name').value;
  userData.surname = document.querySelector('.surname').value;
  userData.email = document.querySelector('.pochta').value;
  userData.about_me = document.querySelector('.info').value;
  userData.phone = document.querySelector('.phone').value;
  userData.password = document.querySelector('.password').value;

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
