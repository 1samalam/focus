const textarea = document.getElementById('text-area-box');

window.electron.onRequestTextToSave((filePath) => {
  const text = textarea.value;
  console.log('Received request to save text to:', filePath); // Debugging line
  window.electron.saveTextToFile(text, filePath);
});

window.electron.onCopyText(() => {
  const text = textarea.value;
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
  }).catch(err => {
    console.error('Error copying text: ', err);
  });
});

window.electron.onLoadTextFromFile((text) => {
  textarea.value = text;
  console.log('Loaded text from file'); // Debugging line
});

// Example: Sending text to save in main process
function saveTextToMainProcess() {
  const text = textarea.value;
  window.electron.saveTextToMainProcess(text);
}
