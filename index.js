const path = require('path');
const electron = require('electron');
const {app, BrowserWindow, Tray, Menu} = electron;

let tray = null;
let mainWindow = null;

app.on('ready', () => {
	const {screen} = electron;
	mainWindow = new BrowserWindow({
		height: 500,
		width: 300,
		frame: false,
		resizable: false,
		show: false
	});
	mainWindow.loadURL(`file://${__dirname}/src/index.html`);

	const createTray = () => {
		const iconName = process.platform === 'win32' ?
			'windows-icon.png' :
			'iconTemplate.png';

		const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
		tray = new Tray(iconPath);
		tray.on('right-click', toggleWindow);
		tray.on('double-click', toggleWindow);

		const trayMenu = Menu.buildFromTemplate([
			{
				label: 'Toggle visibility',
				click: toggleWindow
			}
		]);

		tray.setContextMenu(trayMenu);
		// tray.on('click', function(event) {
		// 	toggleWindow();
		//
		// 	// Show devtools when command clicked
		// 	// if(mainWindow.isVisible() && process.defaultApp && event.metaKey) {
		// 	// 	mainWindow.openDevTools({mode: 'detach'})
		// 	// }
		// })
	};

	const getWindowPosition = () => {
		const windowBounds = mainWindow.getBounds();
		const trayBounds = tray.getBounds();
		let {x, y} = trayBounds;

		if(x === 0 && y === 0) {
			const cursorScreenPoint = screen.getCursorScreenPoint();
			x = cursorScreenPoint.x;
			y = cursorScreenPoint.y - 9;
		}

		// Center window horizontally below the tray icon
		let xBound = Math.round(x + (trayBounds.width / 2) - (windowBounds.width / 2));

		// Position window 4 pixels vertically below the tray icon
		let yBound = Math.round(y + trayBounds.height + 4);

		return {x: xBound, y: yBound}
	};

	const showWindow = () => {
		const position = getWindowPosition();
		mainWindow.setPosition(position.x, position.y, false);
		mainWindow.show();
		mainWindow.focus();
	};

	const toggleWindow = () => {
		if(mainWindow.isVisible()) {
			mainWindow.hide();
		}
		else {
			showWindow();
		}
	};

	createTray();
});