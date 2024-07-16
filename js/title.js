document.addEventListener('DOMContentLoaded', (event) => {
    const textarea = document.getElementById('text-area-box');
    const baseTitle = 'focus'; // Initial base title

    function updateTitle() {
        const text = textarea.value.trim(); // Get the trimmed content of the textarea
        const words = text.split(/\s+/); // Split the text into an array of words

        // Extract the first 4 words or fewer if the text has fewer than 4 words
        const firstFourWords = words.slice(0, 6).join(' ');

        // Update the title
        document.title = firstFourWords ? `${baseTitle} - ${firstFourWords}` : baseTitle;
    }

    // Event listener to update title as you type
    textarea.addEventListener('input', updateTitle);

    // Initial update
    updateTitle();
});
