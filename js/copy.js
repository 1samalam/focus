document.addEventListener('DOMContentLoaded', (event) => {
    const iconElement = document.querySelector('header i');

    // Function to handle click event
    function copyText() {
        // Implement your logic here, for example:
        var textres = document.getElementById('text-area-box')
        textres.select();
        textres.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textres.value)
        const element = document.getElementById('copy-icon')
        const copied = document.querySelector('.copied')
        element.classList.remove("fa-copy");
        element.classList.add("fa-check");
        copied.textContent = 'Copied!' 
        setTimeout(function(){
            copied.textContent = ''
            element.classList.remove("fa-check");
            element.classList.add("fa-copy");
            
        }, 700);
    }

    window.electron.onCopyText(() => {
        copyText()
      });
      

    // Adding click event listener to the icon element
    iconElement.addEventListener('click', copyText);
});


