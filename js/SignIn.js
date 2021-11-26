const { ipcRenderer } = require('electron');
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    let data = {
        email: email.value.trim().toLowerCase(),
        password: password.value.trim()
    };

    ipcRenderer.send('validate-user', data);
});