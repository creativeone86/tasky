const path = require('path');
const electron = require('electron');
const {app, ipcMain} = electron;
const TimerTray = require('./app/TimerTray');
const MainWindow = require('./app/MainWindow');

let tray = null;
let mainWindow = null;
const options = {
	height: 500,
	width: 300,
	frame: false,
	resizable: false,
	show: false,
	skipTaskbar: true,
	webPreferences: {
		backgroundThrottling: false
	}
};
const htmlPath = path.join(__dirname, `./src/index.html`);
const iconName = process.platform === 'win32' ?
	'windows-icon.png' :
	'iconTemplate.png';
const iconPath = path.join(__dirname, `./src/assets/${iconName}`);

app.on('ready', () => {
	mainWindow = new MainWindow(options, htmlPath);
	tray = new TimerTray(iconPath, mainWindow);
	tray.createTray();
});

ipcMain.on('update:timer', (e, timeLeft) => {
	console.log("time left", timeLeft);
	tray.setTitle(timeLeft);// works only on mac
});