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

        modalProf.querySelector('.name').value = user.name;
        modalProf.querySelector('.surname').value = user.surname;
        modalProf.querySelector('.pochta').value = user.email;
        modalProf.querySelector('.info').value = user.about_me;
        modalProf.querySelector('.phone').value = user.phone_number;
        modalProf.querySelector('.password').value = user.password;

        // отображение фотографии пользователя
        const imagePreview = document.getElementById('imagePreview');
        if (user.photo) {
          const base64String = arrayBufferToBase64(user.photo.data);
          imagePreview.style.backgroundImage = `url('data:image/jpeg;base64,${base64String}')`;
          imagePreview.innerHTML = '';//убираем текст добавить фото
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

//не раб
function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}





const saveProfileButton = document.getElementById('saveButton');
saveProfileButton.addEventListener('click', async () => {
  const imagePreview = document.getElementById('imagePreview');
  const formData = new FormData();
  const user_id = localStorage.getItem('user_id'); // пока в ls
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

  const name = document.querySelector('.name').value;
  const surname = document.querySelector('.surname').value;
  const email = document.querySelector('.pochta').value;
  const about_me = document.querySelector('.info').value;
  const phone = document.querySelector('.phone').value;
  const password = document.querySelector('.password').value;

  
  formData.append('name', name);
  formData.append('surname', surname);
  formData.append('email', email);
  formData.append('about_me', about_me);
  formData.append('phone', phone);
  formData.append('password', password);

const response = await fetch(`/users/${user_id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name,
    surname,
    email,
    about_me,
    phone,
    password,
    image: formData.get('image') // добавляем изображение в данные
  }),
});

const data = await response.json();

  if (data.status === 'success') {
    alert('Информация о профиле успешно обновлена');
  } else {
    alert(data.message);
  }
});
