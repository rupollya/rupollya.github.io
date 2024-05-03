function checkForm(event) {
    event.preventDefault();
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

    $.ajax({
        url: '/users/register',
        method: "POST",
        data: JSON.stringify({ phone_number: phone, password: password }),
        contentType: "application/json",
        success: function (response) {
            window.location.href = "osnova.html";
        },
        error: function (xhr, status, error) {
            alert('Ошибка входа. Пожалуйста, проверьте номер телефона и пароль.');
        }
    });
}

//проверка на наличие зарегистрированного пользователя при входе 
function checkLogin(event) {
    event.preventDefault();
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
    $.ajax({
        method: "POST",
        url: "/users/login",
        dataType: 'html',
        data: JSON.stringify({ phone_number: phone, password: password }),
        contentType: "application/json",
        success: function (response) {
            window.location.href = "osnova.html";
        },
        error: function (xhr, status, error) {
            alert('Ошибка входа. Пожалуйста, проверьте номер телефона и пароль.');
        }
    });
}