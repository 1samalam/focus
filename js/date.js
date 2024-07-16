const date = new Date()

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${month}/${day}/${year}`;
console.log(currentDate)

const dateElement = document.querySelector(".date");
dateElement.textContent = currentDate