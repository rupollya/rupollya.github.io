function checkForm(event) {
    var phone = document.getElementById("phone1").value;
    var phoneInput = document.getElementById("phone1");

    var password = document.getElementById("password1").value;
    var passwordInput = document.getElementById("password1");

    const name = document.getElementById("name").value;
    const nameInput = document.getElementById("name");
    if (name.length < 1) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
    } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
    }
    const surname = document.getElementById("surname").value;
    const surnameInput = document.getElementById("surname");
    if (surname.length < 1) {
        surnameInput.classList.add('is-invalid');
        surnameInput.classList.remove('is-valid');
    } else {
        surnameInput.classList.remove('is-invalid');
        surnameInput.classList.add('is-valid');
    }


    const email = document.getElementById("pochta").value;
    const emailInput = document.getElementById("pochta");

    const imageInput = document.getElementById("img").files[0];
    const imageInputt = document.getElementById("img");
    const imageInput1 = document.getElementById("img");
    if (imageInputt.files.length < 1) {
        // Если файл не выбран, добавляем класс 'is-invalid' и удаляем класс 'is-valid'
        imageInput1.classList.add('is-invalid');
        imageInput1.classList.remove('is-valid');
    } else {
        // Если файл выбран, удаляем класс 'is-invalid' и добавляем класс 'is-valid'
        imageInput1.classList.remove('is-invalid');
        imageInput1.classList.add('is-valid');
    }

    const reader = new FileReader();
    if (phone.length !== 11) {
        phoneInput.classList.add('is-invalid');
        phoneInput.classList.remove('is-valid');
    } else {
        phoneInput.classList.remove('is-invalid');
        phoneInput.classList.add('is-valid');
    }
    if (email.length < 1) {
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }
    if (password.length < 8) {
        passwordInput.classList.add('is-invalid');
        passwordInput.classList.remove('is-valid');
    } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
    }
    if (imageInputt.files.length > 0 && phone.length == 11 && email.length > 0 && password.length >= 8 && name.length > 0 && surname.length > 0) {
        reader.onload = function (e) {
            const imageBase64 = e.target.result.split(',')[1]; // Получаем base64-представление изображения

            var zapros = new XMLHttpRequest();
            zapros.open("POST", "/users/register", true);
            zapros.setRequestHeader("Content-Type", "application/json");

            zapros.onload = function () {
                if (zapros.status === 200) {
                    window.location.href = "good_regis.html";
                } else {
                    // Обработка ошибок
                    try {
                        var errorResponse = JSON.parse(zapros.responseText);
                        if (errorResponse.error) {
                            alert("Ошибка: " + errorResponse.error);
                        } else {
                            alert("Произошла ошибка при обработке запроса.");
                        }
                    } catch (e) {
                        alert("Произошла неизвестная ошибка.");
                    }
                }
            };


            zapros.send(JSON.stringify({
                phone_number: phone,
                password: password,
                name: name,
                surname: surname,
                email: email,
                photo: imageBase64
            }));
        };

        reader.readAsDataURL(imageInput);
    }
}


function checkLogin(event) {
    var phone = document.getElementById("phone1").value;
    var password = document.getElementById("password1").value;
    var phoneInput = document.getElementById("phone1");
    var passwordInput = document.getElementById("password1");

    if (phone.length !== 11) {
        phoneInput.classList.add('is-invalid');
        phoneInput.classList.remove('is-valid');
    } else {
        phoneInput.classList.remove('is-invalid');
        phoneInput.classList.add('is-valid');
    }

    if (password.length < 8) {
        passwordInput.classList.add('is-invalid');
        passwordInput.classList.remove('is-valid');
    } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
    }

    if (phone.length == 11 && password.length >= 8) {
        var zapros = new XMLHttpRequest();
        zapros.open("POST", "/users/login", true);
        zapros.setRequestHeader("Content-Type", "application/json");

        zapros.onload = function () {
            if (zapros.status === 200) {
                var response = JSON.parse(zapros.responseText);
                if (response.user_id) {
                    setCookie('user_id', response.user_id, { 'max-age': 3600 }); // Сохранение id пользователя в куки
                    //localStorage.setItem('user_id', response.user_id);
                    window.location.href = "osnova.html";
                } else {
                    console.error('user_id не получен:', response);
                }
            } else {
                // Обработка ошибок
                try {
                    var errorResponse = JSON.parse(zapros.responseText);
                    if (errorResponse.detail) {
                        alert("Ошибка: " + errorResponse.detail);
                    } else {
                        alert("Произошла ошибка при обработке запроса.");
                    }
                } catch (e) {
                    alert("Произошла неизвестная ошибка.");
                }
            }
        };

        zapros.send(JSON.stringify({ phone_number: phone, password: password }));
    }
}

const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
};

// Функция получения куки
const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};