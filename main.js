const { app, BrowserWindow, ipcMain, Notification } = require('electron');
require('./db/database');

const Disease = require('./models/disease');
const User = require('./models/user');
const Activity = require('./models/activity');


let win;
let commonUserWin;
let adminUserWin;
let userToSend = [];
let userId;

function aboutWindow() {
    // Creamos la ventana del navegador
    win = new BrowserWindow({
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('./views/About.html');

    win.maximize();
    win.resizable = false;

}

function commonUser() {
    commonUserWin = new BrowserWindow({
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    commonUserWin.loadFile('./views/Welcome.html');
    commonUserWin.maximize();
    commonUserWin.resizable = false;

}

function adminUser() {
    adminUserWin = new BrowserWindow({
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    adminUserWin.loadFile('./views/DiseasesManager.html');
    adminUserWin.maximize();
    adminUserWin.resizable = false;

}


app.whenReady().then(aboutWindow);

// Actividad
ipcMain.on('new-activity', async(e, args) => {
    const newActivity = new Activity(args);
    const activitySaved = await newActivity.save();
});

ipcMain.on('get-user-activity', (e, args) => {
    e.reply('get-user-activity', userToSend);
});

ipcMain.on('get-data', async(e, args) => {
    const data = await Activity.find({ "userId": args });
    e.reply('get-data', JSON.stringify(data));
});



// Enfermedades
ipcMain.on('new-disease', async(e, args) => {
    const newDisease = new Disease(args);
    const diseaseSaved = await newDisease.save();
    e.reply('disease-created', JSON.stringify(diseaseSaved));
});

ipcMain.on('get-diseases', async(e, args) => {
    const diseases = await Disease.find();
    e.reply('get-diseases', JSON.stringify(diseases));
});

ipcMain.on('get-diseases-list', async(e, args) => {
    const diseasesList = await Disease.find();
    e.reply('diseases-list', JSON.stringify(diseasesList));
});

ipcMain.on('delete-disease', async(e, args) => {
    const diseaseDeleted = await Disease.findByIdAndDelete(args);
    e.reply('delete-disease', JSON.stringify(diseaseDeleted));
});

ipcMain.on('edit-disease', async(e, args) => {
    const disease = await Disease.findById(args);
    e.reply('disease-edit', JSON.stringify(disease));
});

ipcMain.on('edit-disease-data', async(e, args) => {
    const diseaseUpdated = await Disease.findByIdAndUpdate(args.idDisease, {
        name: args.name,
        questions: args.questions,
        causes: args.causes,
        advices: args.advices
    }, { new: true });
    e.reply('disease-updated', JSON.stringify(diseaseUpdated));
});

ipcMain.on('logout-clicked', (e, args) => {
    aboutWindow();
    adminUserWin.close();
});

ipcMain.on('welcome-logout', (e, args) => {
    aboutWindow();
    commonUserWin.close();
});



// Usuarios
ipcMain.on('new-user', async(e, args) => {
    const alreadyExist = await User.find({ "email": args.email });
    let flag;
    if (alreadyExist.length > 0) {
        flag = true;
    } else {
        flag = false;
        const newUser = new User(args);
        await newUser.save();
    }
    e.reply('user-created', flag);
});

ipcMain.on('validate-user', async(e, args) => {
    const user = await User.find({ email: args.email, password: args.password });
    if (user.length > 0) {
        if (user[0].code === 'Juan') {
            adminUser();
            win.close();
        } else {
            commonUser();
            win.close();
        }
    } else {
        new Notification({
            title: "Login",
            body: 'email o password equivocado, vuelva a intentarlo.'
        }).show()
    }
    userToSend = JSON.stringify(user);
    e.reply('validate-user', userToSend);
});

ipcMain.on('get-user', (e, args) => {
    e.reply('send-user', userToSend);
});

ipcMain.on('get-user-manager', (e, args) => {
    e.reply('send-user', userToSend);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        aboutWindow();
    }
});