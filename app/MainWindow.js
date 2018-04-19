const electron = require('electron');
const {BrowserWindow} = electron;

class MainWindow extends BrowserWindow {
	constructor(options, htmlPath) {
		super(options);
		this.loadURL(`file://${htmlPath}`);

		this.on('blur', this.onBlur.bind(this));
	}

	onBlur() {
		this.hide();
	}

}


module.exports = MainWindow;