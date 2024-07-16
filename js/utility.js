document.addEventListener('DOMContentLoaded', (event) => {
    const textarea = document.querySelector('textarea');

    function resizeTextarea() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        window.scrollTo(0, scrollTop); // Restore scroll position
    }

    textarea.addEventListener('input', resizeTextarea);
    textarea.addEventListener('change', resizeTextarea); // Handle change events if needed

    resizeTextarea(); // Initial resize to fit content on load
});


