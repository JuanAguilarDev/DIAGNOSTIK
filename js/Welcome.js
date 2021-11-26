const { ipcRenderer } = require('electron');
const diseaseList = document.querySelector('#diseaseList');
const logOutBtn = document.querySelector('#logOutBtn');
const userName = document.getElementById('userName');
const questionsList = document.querySelector('#questionsList');
const answer = document.querySelector('#answer');

let diseasesList = [];
let user = {};
let defaultAdvice = 'Para mayor información, por favor hable con su médico de familia. Si usted piensa que su problema es grave llame a su médico enseguida.';
let defaultCase = 'Lo sentimos, por el momento no podemos identificar la enfermedad a la cual se atribuye su síntoma.';
let questions = [];
let diseaseIndex;
let status = [
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false },
    { 'isVisited': false }
];
let userId;

const areAllChecked = (currentValue) => currentValue == true;


// logout
logOutBtn.addEventListener('click', () => {
    ipcRenderer.send('welcome-logout');
});


function finishClick() {
    $("#myCarousel").carousel("next");
};

// Funcion para noSelected
function noSelected(index) {
    status[index] = true;
    if (status.every(areAllChecked)) {
        $("#myCarousel").carousel("next");
        answer.innerHTML = '';
        answer.innerHTML = `
        <div class="row">
            <div id="title">
                <h2 class="fw-bolder text-center">Posibles causas</h2>
            </div>
            <div class="row justify-content-between">
                <div class="col-8">
                    <div id="diagnostic">
                        <h3 class="fw-bolder text-danger">Diagnostico</h3>
                        <p>${defaultCase}</p>
                    </div>
                </div>
                <div class="col-3 text-end">
                    <img src="../img/diagnostic.png" alt="Diagnostic">
                </div>
            </div>
            <hr class="my-1">
            <div class="row justify-content-between">
                <div class="col-8">
                    <div id="advice">
                        <h3 class="fw-bolder text-success">Consejo</h3>
                        <p>${defaultAdvice}</p>
                    </div>
                </div>
                <div class="col-3 text-end">
                    <img src="../img/advice.png" alt="Advice">
                </div>
            </div>
            <hr class="my-1">
            <div class="col-12 text-center py-2">
                <button onclick="finishClick()" id="finishBtn" class="btn btn-primary">Comenzar de nuevo</button>
            </div>
        </div>
        `;
    }

}


// Funcion para yesSelected
function yesSelected(index) {
    $("#myCarousel").carousel("next");
    const cause = questions[diseaseIndex].causes[index];
    const advice = questions[diseaseIndex].advices[index];
    const date = new Date().toUTCString().toString();

    const userActivity = {
        date: date,
        disease: questions[diseaseIndex].name,
        cause: cause,
        advice: advice,
        userId: userId
    }

    ipcRenderer.send('new-activity', userActivity);

    // Limpiamos nuestro div de cualquier contenido que haya tenido
    answer.innerHTML = '';

    // Limpiamos el valor de visita de cada boton NO
    status.map((e, index) => {
        e[index] = false;
    });


    answer.innerHTML = `
    <div class="row">
        <div id="title">
            <h2 class="fw-bolder text-center">Posibles causas</h2>
        </div>
        <div class="row justify-content-between">
            <div class="col-8">
                <div id="diagnostic">
                    <h3 class="fw-bolder text-danger">Diagnostico</h3>
                    <p>${cause}</p>
                </div>
            </div>
            <div class="col-3 text-end">
                <img src="../img/diagnostic.png" alt="Diagnostic">
            </div>
        </div>
        <hr class="my-1">
        <div class="row justify-content-between">
            <div class="col-8">
                <div id="advice">
                    <h3 class="fw-bolder text-success">Consejo</h3>
                    <p>${advice}</p>
                </div>
            </div>
            <div class="col-3 text-end">
                <img src="../img/advice.png" alt="Advice">
            </div>
        </div>
        <hr class="my-1">
        <div class="col-12 text-center py-2">
            <button onclick="finishClick()" id="finishBtn" class="btn btn-primary">Comenzar de nuevo</button>
        </div>
    </div>
    `;
}

// Funcion para renderizar las preguntas 
function diseaseSelected(index) {
    $("#myCarousel").carousel("next");
    diseaseIndex = index;
    questionsList.innerHTML = '';
    questions[index].questions.forEach((element, index) => {
        questionsList.innerHTML += `
        <li id="listItem" class="row bg-light justify-content-around my-1">
            <div class="col-4 py-2 align-self-center">
                <div class="row">
                    <p class="mt-1">${element}</p>
                </div>
            </div>
            <div class="col-4 text-end align-self-center">
                <div class="row justify-content-around">
                    <div class="col-5">
                        <button onclick="noSelected(${index})" class="btn btn-danger" id="btnNo">NO</button>
                    </div>
                    <div class="col-5">
                        <button onclick="yesSelected(${index})" class="btn btn-primary" id="btnYes">SI</button>
                    </div>
                </div>
            </div>
        </li>
        `;
    });

}




// Funcion que renderiza las enfermedades
function renderDiseases(diseases) {
    // Limpiamos la lista
    diseaseList.innerHTML = '';
    questions = diseases;
    diseases.map((d, index) => {
        diseaseList.innerHTML += `
        <li id="listItem" class="row bg-light justify-content-around my-1">
            <div class="col-4 py-2 align-self-center">
                <div class="row">
                    <h4 class="fw-bolder mt-1">${d.name}</h4>
                </div>
            </div>
            <div class="col-4 text-end align-self-center">
                <div class="row justify-content-around">
                    <div class="col-5">
                        <button onclick="diseaseSelected(${index})" class="btn btn-primary" id="btnSelect">Seleccionar</button>
                    </div>
                </div>
            </div>
        </li>
    `;
    });
}




// Pedimos los datos
ipcRenderer.send('get-diseases-list');


// Obtenemos las tareas 
ipcRenderer.on('diseases-list', (e, args) => {
    diseasesList = JSON.parse(args);
    renderDiseases(diseasesList);
});

ipcRenderer.send('get-user');

ipcRenderer.on('send-user', (e, args) => {
    user = JSON.parse(args);
    userName.innerText = user[0].name;
    userId = user[0]._id;
});