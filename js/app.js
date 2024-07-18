const { app, BrowserWindow, globalShortcut, ipcMain, dialog, nativeImage, Menu, document, window } = require('electron');
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");
const { Titlebar } = require('custom-electron-titlebar/main');
const fs = require('fs');
const path = require('path');

setupTitlebar()

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1000,
		height: 600,
    frame: false, // Use to linux
		titleBarStyle: 'hidden',
		titleBarOverlay: true,
		webPreferences: {
			sandbox: false,
			preload: path.join(__dirname, 'preload.js')
		}
	})
  
	const menu = Menu.buildFromTemplate(exampleMenuTemplate)
  Menu.setApplicationMenu(menu)
	// and load the index.html of the app.
	// mainWindow.loadFile('index.html')
	win.loadFile('index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Attach listeners
	attachTitlebarToWindow(win)

  ipcMain.on('update-title', (event, title) => {
		win.setTitle(title);
	});
}

const saveText = async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  console.log('Current filePath:', focusedWindow.filePath); // Debugging line
  if (focusedWindow) {
    const filePath = focusedWindow.filePath || null;
    console.log('Checked filePath:', filePath); // Debugging line
    if (filePath) {
      // If filePath exists, use it for saving
      focusedWindow.webContents.send('request-text-to-save', filePath);
    } else {
      // If filePath doesn't exist, trigger Save As or debug further
      console.log('No valid filepath found.'); // Debugging line
      saveAs()
      
    }
  }
};
const saveAs = async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    const result = await dialog.showSaveDialog(focusedWindow, {
      title: 'Save Text As',
      defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!result.canceled && result.filePath) {
      console.log('File path chosen:', result.filePath); // Debugging line
      focusedWindow.webContents.send('request-text-to-save', result.filePath);
      focusedWindow.filePath = result.filePath; // Update filePath in window object
      console.log('Updated the file path:', focusedWindow.filePath); // Debugging line
      focusedWindow.title = `focus - ${focusedWindow.filePath}`
      win.setTitle(focusedWindow.title);
    }
  }
};

const copyText = () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.webContents.send('copy-text');
  }
};

const openText = async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    const result = await dialog.showOpenDialog(focusedWindow, {
      title: 'Open Text File',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      console.log('File path chosen:', filePath); // Debugging line
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      focusedWindow.webContents.send('load-text-from-file', fileContent);
      focusedWindow.filePath = filePath; // Update filePath in window object
      console.log('Updated the file path:', focusedWindow.filePath); // Debugging line
      focusedWindow.title = `focus - ${focusedWindow.filePath}`
    }
  }
};

const exampleMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: () => openText()
			},
			{
				label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => saveText()
			},
			{
				label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => saveAs()
			},
      {
				label: 'Quit',
				click: () => app.quit()
			},
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				label: 'Copy Text',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => copyText()
			},
		]
	},
	{
		label: '&View',
		submenu: [
			{ role: 'reload' },
			{ type: 'separator' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ role: 'resetZoom' },
		]
	}
]


app.whenReady().then(() => {
  globalShortcut.register('CmdOrCtrl+S', saveText);
  globalShortcut.register('CmdOrCtrl+Shift+S', saveAs);
  globalShortcut.register('CmdOrCtrl+Shift+C', copyText);
  globalShortcut.register('CmdOrCtrl+O', openText);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('save-text-to-file', (event, text, filePath) => {
  console.log('Saving text to file:', filePath); // Debugging line
  fs.writeFileSync(filePath, text);
  console.log('File saved successfully'); // Debugging line
});
