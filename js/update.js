const { ipcRenderer } = require('electron');
const diseaseName = document.querySelector('#name');
const diseaseForm = document.querySelector('#diseaseForm');
const diseaseQuestions = document.querySelectorAll('.question');
const diseaseAdvices = document.querySelectorAll('.advice');
const diseaseAnswers = document.querySelectorAll('.answer');
const msg = document.querySelector('#msg');

let questionsArr = [];
let answersArr = [];
let advicesArr = [];
let idDisease;


ipcRenderer.on('disease-edit', (e, args) => {
    const disease = JSON.parse(args);
    idDisease = disease._id;
    diseaseName.value = disease.name;

    for (let i = 0; i < disease.questions.length; i++) {
        diseaseQuestions[i].value = disease.questions[i];
        diseaseAnswers[i].value = disease.causes[i];
        diseaseAdvices[i].value = disease.advices[i];
    }
});

diseaseForm.addEventListener('submit', e => {
    e.preventDefault();

    diseaseAnswers.forEach(e => {
        answersArr.push(e.value);
    });

    diseaseQuestions.forEach(e => {
        questionsArr.push(e.value);
    });

    diseaseAdvices.forEach(e => {
        advicesArr.push(e.value);
    });

    const disease = {
        name: diseaseName.value,
        questions: questionsArr,
        causes: answersArr,
        advices: advicesArr
    };

    ipcRenderer.send('edit-disease-data', {...disease, idDisease });

});

function msgDisplay() {
    msg.style.display = "none";
}

ipcRenderer.on('disease-updated', (e, args) => {
    msg.style.display = "block";
    setTimeout(msgDisplay, 2000);
    clearTimeout();
});