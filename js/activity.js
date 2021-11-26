const { ipcRenderer } = require('electron');
const container = document.querySelector('#cont');

let userId;
let activities = [];

function renderActivities(activities) {
    container.innerHTML = '';
    console.log(activities);
    activities.map((e, index) => {
        container.innerHTML += `
        
        <div class="d-block w-100 d-flex justify-content-center">
            <div class="col-12">
                <div class="p-3 row text-center">
                    <h3>Nombre del sintoma: <span class="text-danger">${e.disease}</span></h3>
                    <p id="dateTxt"><b>Fecha:</b> <span>${e.date}</span></p>
                </div>
                <div class="p-3 row">
                    <h3 class="fw-bolder form-label text-danger">Diagnostico</h3>
                    <p>${e.cause}
                    </p>
                </div>
                <div class="p-3 row">
                    <h3 class="fw-bolder form-label text-success">Consejo</h3>
                    <p>${e.advice}</p>
                </div>
            </div>
        </div>
  
        `;
    })
}

// Datos del usuario
ipcRenderer.send('get-user-activity');

ipcRenderer.on('get-user-activity', (e, args) => {
    user = JSON.parse(args);
    userId = user[0]._id;
});

setTimeout(() => {
    // Pedimos los datos 
    ipcRenderer.send('get-data', userId);
}, 500);
clearTimeout();

//Recibimos los datos 
ipcRenderer.on('get-data', (e, args) => {
    activities = JSON.parse(args);
    console.log(activities + 'data')
    renderActivities(activities);
});