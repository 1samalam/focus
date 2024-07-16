// open.js

const textarea = document.getElementById('text-area-box');

// Function to load text from file
window.electron.onLoadTextFromFile((text) => {
  textarea.value = text;
  console.log('Loaded text from file:', text); // Debugging line
});

// Function to handle saving text (if needed)
window.electron.onRequestTextToSave((event, filePath) => {
  const text = textarea.value;
  console.log('Received request to save text to:', filePath); // Debugging line
  window.electron.saveTextToFile(text, filePath);
});
