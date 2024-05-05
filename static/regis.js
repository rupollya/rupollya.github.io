



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
    for (let i = 0; i < 16; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById("generatedPassword").textContent = password;
    document.getElementById("copyPassword").classList.remove("disabled");
}

function copyPassword() {
    const passwordElement = document.getElementById("generatedPassword");
    navigator.clipboard.writeText(passwordElement.textContent);
    document.getElementById("copyPassword").classList.add("disabled");
}

document.getElementById("copyPassword").addEventListener("click", copyPassword);