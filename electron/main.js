const {app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const server = require('../server/server');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });
    const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startUrl);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
        server.close();
    });
};


server.open(() => app.on('ready', createWindow));

