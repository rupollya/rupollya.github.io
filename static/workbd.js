function checkForm(event) {
    var phone = document.getElementById("phone1").value;
    var password = document.getElementById("password1").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    var phoneInput = document.getElementById("phone1");
    var passwordInput = document.getElementById("password1");
    var confirmPasswordInput = document.getElementById("confirm-password");

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

    if (password !== confirmPassword || confirmPassword.length < 8) {
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordInput.classList.remove('is-valid');
    } else {
        confirmPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.add('is-valid');
    }

    if (phoneInput.classList.contains('is-valid') && passwordInput.classList.contains('is-valid') && confirmPasswordInput.classList.contains('is-valid')) {

        var zapros = new XMLHttpRequest();
        zapros.open("POST", "/users/register", true);
        zapros.setRequestHeader("Content-Type", "application/json");

        zapros.onload = function () {
            if (zapros.status === 200) {
                // Перенаправляем пользователя на текущую страницу после регистрации
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
            password: password
        }));
    }
}

function checkLogin(event) {
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var phoneInput = document.getElementById("phone");
    var passwordInput = document.getElementById("password");

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

    var zapros = new XMLHttpRequest();
    zapros.open("POST", "/users/login", true);
    zapros.setRequestHeader("Content-Type", "application/json");

    zapros.onload = function () {
        if (zapros.status === 200) {
            var response = JSON.parse(zapros.responseText);
            if (response.user_id) {
                localStorage.setItem('user_id', response.user_id);
                window.location.href = "osnova.html";
            } else {
                console.error('user_id не получен:', response);
            }
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

    zapros.send(JSON.stringify({ phone_number: phone, password: password }));
}