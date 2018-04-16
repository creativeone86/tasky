const electron = require('electron');
const {Tray, Menu} = electron;

class TimerTray extends Tray{
	constructor(iconPath, window) {
		super(iconPath);
		this.window = window;

	}

	createTray() {
		this.on('right-click', this.toggleWindow);
		this.on('double-click', this.toggleWindow);

		const trayMenu = Menu.buildFromTemplate([
			{
				label: 'Toggle visibility',
				click: this.toggleWindow.bind(this)
			}
		]);

		this.setContextMenu(trayMenu);
	}

	getWindowPosition() {
		const windowBounds = this.window.getBounds();
		const trayBounds = this.getBounds();
		let {x, y} = trayBounds;

		if(x === 0 && y === 0) {
			const {screen} = electron;
			const cursorScreenPoint = screen.getCursorScreenPoint();
			x = cursorScreenPoint.x;
			y = cursorScreenPoint.y - 9;
		}

		// Center window horizontally below the tray icon
		let xBound = Math.round(x + (trayBounds.width / 2) - (windowBounds.width / 2));

		// Position window 4 pixels vertically below the tray icon
		let yBound = Math.round(y + trayBounds.height + 4);

		return {x: xBound, y: yBound}
	}

	showWindow() {
		const position = this.getWindowPosition();
		this.window.setPosition(position.x, position.y, false);
		this.window.show();
		this.window.focus();
	}

	toggleWindow() {
		if(this.window.isVisible()) {
			this.window.hide();
		}
		else {
			this.showWindow();
		}
	}
}

module.exports = TimerTray;