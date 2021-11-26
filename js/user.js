const { ipcRenderer } = require('electron');
const userForm = document.querySelector('#userForm');
const userName = document.querySelector('#username');
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const userCode = document.querySelector('#code');
const textMsg = document.querySelector('#msgText');

function isValidEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}

userForm.addEventListener('submit', e => {
    e.preventDefault();

    const user = {
        name: userName.value.trim(),
        email: userEmail.value.trim().toLowerCase(),
        password: userPassword.value.trim(),
        code: userCode.value.trim()
    }

    if (!isValidEmail(user.email)) {
        alert('El correo no cumple con el formato adecuado. El formato debe ser: nombre usuario + @ + servidor + dominio');
        return false;
    } else {
        ipcRenderer.send('new-user', user);
    }

    userForm.reset();
});

function msgDisplay() {
    msg.style.display = "none";
}

// Recibimos la respuesta
ipcRenderer.on('user-created', (e, args) => {
    if (!args) {
        msg.style.background = "#00B84B";
        textMsg.textContent = "El usuario ha sido registrado de forma exitosa.";
    } else {
        msg.style.background = "#F32013";
        textMsg.textContent = "Este correo ya fue registrado antes.";
    }
    msg.style.display = "block";
    setTimeout(msgDisplay, 2000);
    clearTimeout();
});