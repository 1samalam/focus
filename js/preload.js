const { contextBridge, ipcRenderer } = require('electron');
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')
const path = require('path')

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('update-title', document.title);

  // Listen for title changes and send them to the main process
  const observer = new MutationObserver(() => {
    ipcRenderer.send('update-title', document.title);
  });

  observer.observe(document.querySelector('title'), { childList: true });
});

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type])
	}

	// eslint-disable-next-line no-new
	new CustomTitlebar({
		backgroundColor: TitlebarColor.fromHex('#2c2c2c'),
		menuTransparency: 0.2,
    icon: path.resolve('./assets/', 'icon.png'),
    enableMnemonics: true
		// icon: path.resolve('example/assets', 'logo.svg'),
		// icons: path.resolve('example/assets', 'icons.json'),
	})
})
contextBridge.exposeInMainWorld('electron', {
  onRequestTextToSave: (callback) => ipcRenderer.on('request-text-to-save', (event, filePath) => {
    callback(event, filePath);
  }),
  saveTextToFile: (text, filePath) => ipcRenderer.send('save-text-to-file', text, filePath),
  onCopyText: (callback) => ipcRenderer.on('copy-text', callback),
  onLoadTextFromFile: (callback) => ipcRenderer.on('load-text-from-file', (event, text) => {
    callback(text);
  }),
});
