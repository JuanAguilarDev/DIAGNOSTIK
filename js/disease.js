const diseaseForm = document.querySelector('#diseaseForm');
const diseaseName = document.querySelector('#name');
const q = document.querySelectorAll('.question');
const a = document.querySelectorAll('.answer');
const adv = document.querySelectorAll('.advice');
const msg = document.querySelector('#msg');
const { ipcRenderer } = require('electron');

let answersArr = [];
let questionsArr = [];
let advicesArr = [];

// Events

diseaseForm.addEventListener('submit', e => {
    e.preventDefault();

    q.forEach((e) => {
        questionsArr.push(e.value.trim());
    });

    a.forEach((e) => {
        answersArr.push(e.value.trim());
    });

    adv.forEach((e) => {
        advicesArr.push(e.value.trim());
    })



    const disease = {
        name: diseaseName.value,
        questions: questionsArr,
        causes: answersArr,
        advices: advicesArr
    };

    ipcRenderer.send('new-disease', disease);

    diseaseForm.reset();
});

function msgDisplay() {
    msg.style.display = "none";
}

// Recibimos la respuesta
ipcRenderer.on('disease-created', (e, args) => {
    msg.style.display = "block";
    setTimeout(msgDisplay, 2000);
    clearTimeout();
});