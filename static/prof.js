const modalProf = document.getElementById('modal_prof');
modalProf.addEventListener('show.bs.modal', (event) => {
  const user_id = localStorage.getItem('user_id');
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
          //imagePreview.style.backgroundImage = url(`data:image/jpeg;base64,${user.photo}`);  
          imagePreview.style.backgroundImage = `url(data:image/jpeg;base64,${user.photo})`;
         // imagePreview.style.backgroundSize = 'cover';
          imagePreview.style.backgroundRepeat = 'no-repeat';
          imagePreview.style.backgroundSize = '100% 100%';
          imagePreview.style.backgroundPosition = 'center';          

          imagePreview.innerHTML = ''; // убираем текст "Добавить фото" 
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

const saveProfileButton = document.getElementById('saveButton');
saveProfileButton.addEventListener('click', async () => {
  const imagePreview = document.getElementById('imagePreview');
  const user_id = localStorage.getItem('user_id'); // пока в ls

  const name = document.querySelector('.name').value;
  const surname = document.querySelector('.surname').value;
  const email = document.querySelector('.pochta').value;
  const about_me = document.querySelector('.info').value;
  const phone = document.querySelector('.phone').value;
  const password = document.querySelector('.password').value;

  let imageBase64 = null;

  if (imagePreview.style.backgroundImage) {
    const base64Data = imagePreview.style.backgroundImage.split(',')[1].slice(0, -2);
    imageBase64 = base64Data;
  }
  console.log(imageBase64);
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
      photo: imageBase64
    }),
  });

  const data = await response.json();

  if (data.status === 'success') {
    alert('Информация о профиле успешно обновлена');
  } else {
    alert(data.message);
  }
});

// Обработчик для загрузки изображения
const imagePreview = document.getElementById('imagePreview');
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
        imagePreview.innerHTML = ''; // убираем текст добавить фото
        console.log(e.target.result);
      }

      reader.readAsDataURL(fileInput.files[0]);
    }
  });

  fileInput.click();
});