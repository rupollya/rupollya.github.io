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

    if (phone.length === 11 && password.length >= 8 && password === confirmPassword) {
        var userKey = 'user' + '+' + phone;
        var userData = { phone: phone, password: password };
        localStorage.setItem(userKey, JSON.stringify(userData));
        window.location.href = "osnova.html";
    }
}


//проверка на наличие зарегистрированного пользователя при входе 
function checkLogin(event) {
    event.preventDefault();
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var phoneInput = document.getElementById("phone");
    var passwordInput = document.getElementById("password");
    var userKey = 'user' + '+' + phone; // Формируем ключ для поиска пользователя
    var userData = JSON.parse(localStorage.getItem(userKey));
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
    if (phone.length === 11 && password.length >= 8) {
        // выполняйте проверку на наличие пользователя
        if (userData && userData.password === password) {
            window.location.href = "osnova.html";
        } else {
            alert('Неправильный номер телефона или пароль. Попробуйте еще раз или зарегистрируйтесь.');
        }
    }
}


//проверка на наличие зарегистрированного пользователя при входе 



//ограничения на ввод номера телефона только цифры
document.getElementById('phone').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
});

document.getElementById('phone1').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
});
/////////////////генератор пароля
function generatePassword(event) {
    event.preventDefault();

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById("generatedPassword").textContent = password;
}