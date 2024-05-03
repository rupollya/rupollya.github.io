//вставка информации
const modalProf = document.getElementById('modal_prof');

modalProf.addEventListener('show.bs.modal', (event) => {
  const user_id = event.relatedTarget.dataset.userId;

  const get_zapross = new XMLHttpRequest();
  get_zapross.open('GET', `/users/${user_id}`);
  get_zapross.onload = () => {
    if (get_zapross.status === 200) {
      const data = JSON.parse(get_zapross.responseText);
      if (data.status === 'success') {
        const user = data.data;

        modalProf.querySelector('.name').value = user.name;
        modalProf.querySelector('.surname').value = user.surname;
        modalProf.querySelector('.pochta').value = user.email;
        modalProf.querySelector('.info').value = user.about_me;
        modalProf.querySelector('.phone').value = user.phone;
        modalProf.querySelector('.password').value = user.password;
      } else {
        alert(data.message);
      }
    } else {
      alert('Произошла ошибка при получении информации о пользователе');
    }
  };
  get_zapross.send();
});



const saveProfileButton = document.getElementById('saveButton');
saveProfileButton.addEventListener('click', async () => {
    const imagePreview = document.getElementById('imagePreview');
    const formData = new FormData();

    //загружаем изображение профиля
    imagePreview.addEventListener('click', function () {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview.style.backgroundImage = `url(${e.target.result})`;
                    formData.append('image', fileInput.files[0]);
                }

                reader.readAsDataURL(fileInput.files[0]);
            }
        });

        fileInput.click();
    });

    // Получение других данных профиля
    const name = document.querySelector('.name').value;
    const surname = document.querySelector('.surname').value;
    const email = document.querySelector('.pochta').value;
    const info = document.querySelector('.info').value;
    const phone = document.querySelector('.phone').value;
    const password = document.querySelector('.password').value;

    // Добавление данных профиля в форму
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('email', email);
    formData.append('info', info);
    formData.append('phone', phone);
    formData.append('password', password);

    // Отправка запроса на сервер
    const response = await fetch(`/users/${user_id}`, {
        method: 'PUT',
        body: formData,
    });

    const data = await response.json();

    // Обработка ответа сервера
    if (data.status === 'success') {
        alert('Информация о профиле успешно обновлена');
    } else {
        alert(data.message);
    }
});