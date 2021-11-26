const { ipcRenderer } = require('electron');
const diseasesList = document.querySelector("#diseasesList");
const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.getElementById('userName');

let diseases = [];
let user = {};


logOutBtn.addEventListener('click', () => {
    ipcRenderer.send('logout-clicked');
})

// Funcion para borrar
function deleteDisease(id) {
    const result = confirm('Are you sure you want to delete it?');
    if (result) {
        ipcRenderer.send('delete-disease', id);
    } else {
        return;
    }
}

// Funcion para editar
function editTask(id) {
    ipcRenderer.send('edit-disease', id);
}

// Funcion que renderiza las enfermedades
function renderDiseases(diseases) {
    // Limpiamos la lista
    diseasesList.innerHTML = '';
    diseases.map(d => {
        diseasesList.innerHTML += `
        <li class="list-group-item">
            <div class="row">
                <h2><b>Disease Name: </b> ${d.name}</h2>
                <p><b>Disease id:</b> ${d._id}</p>
                <button onclick="deleteDisease('${d._id}')" class="btn btn-primary col-6">
                    Delete
                </button>
                <a onclick="editTask('${d._id}')" class="btn btn-danger col-6" href="../views/UpdateDisease.html">
                    Edit
                </a>
            </div>
        </li>
    `;
    })
}



// Pedir tareas 
ipcRenderer.send('get-diseases');

// Recibimos las tareas
ipcRenderer.on('get-diseases', (e, args) => {
    const diseasesReceived = JSON.parse(args);
    diseases = diseasesReceived;
    renderDiseases(diseases);
});

// Datos de los usuarios
ipcRenderer.send('get-user-manager');

ipcRenderer.on('send-user', (e, args) => {
    user = JSON.parse(args);
    userName.innerText = user[0].name;
});

// Recibimos la tarea eliminada
ipcRenderer.on('delete-disease', (e, args) => {
    const diseaseDeleted = JSON.parse(args);
    const newDiseases = diseases.filter(d => {
        return d._id !== diseaseDeleted._id;
    })
    diseases = newDiseases;
    renderDiseases(diseases);
})


// Recibimos la enfermedad a editar
ipcRenderer.on('disease-edit', (e, args) => {
    const disease = JSON.parse(args);
    console.log(disease);
})