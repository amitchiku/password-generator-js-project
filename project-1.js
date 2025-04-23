// Select DOM elements from your html syntax
const inputslider = document.querySelector("[data-length-slider]");
const lengthdisplay = document.querySelector("[data-length-container]");
const passworddisplay = document.querySelector("[data-passworddisplay]");
const copybutton = document.querySelector(".display-container button");
const copymessage = document.querySelector("[data-copymsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const generatebutton = document.querySelector(".generate-button");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

// Create an Array in which all symbols are present
const symbols = [
    '!', '@', '#', '$', '%', '^', '&', '*',
    '(', ')', '-', '_', '=', '+', '[', ']',
    '{', '}', ';', ':', "'", '"', ',', '<',
    '.', '>', '/', '?', '\\', '|', '`', '~'
];

// State variables in the initial stage of the website
let password = "";
// initial password is null
let passwordlength = 1;
// initial password length is one
let checkcount = 0;
// initial checkcount is zero

// Update slider and length display in the page 
function sliderhander() {
    // Create a function for displaying the password length on web page
    inputslider.value = passwordlength;
    // Store the passwordlength in this variable
    lengthdisplay.innerText = passwordlength;
    // The text on page is same as the passwordlength
}

// Random generators
function getrandominteger(min, max) {
    // Create a function to get random value in the given range
    return Math.floor(Math.random() * (max - min)) + min;
    // Math.floor is used for rounding off float values
    // Math.random gives a random number from 0 to 1
    // The result is a value between min and max (excluding max)
}

function generaterandomnumber() {
    return getrandominteger(0, 10).toString(); // Ensures string
    // Return a random number from 0-9 and convert it to string
}

function generateuppercase() {
    return String.fromCharCode(getrandominteger(65, 91));
    // Return uppercase letter using ASCII values A-Z (65–90)
}

function generatelowercase() {
    return String.fromCharCode(getrandominteger(97, 123));
    // Return lowercase letter using ASCII values a-z (97–122)
}

function generatesymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    // Get a random index from symbols array
    return symbols[randomIndex];
}

// Copy password to clipboard
async function copycontent() {
    try {
        await navigator.clipboard.writeText(passworddisplay.value);
        // Use clipboard API to copy password
        copymessage.innerText = 'copied';
        // Show copied message
    } catch (e) {
        copymessage.innerText = 'failed';
        // Show error if copying fails
    }

    copymessage.style.display = "block";
    copymessage.classList.add("active");
    // Show message visually
    setTimeout(() => {
        copymessage.classList.remove("active");
        copymessage.style.display = "none";
        // Hide the message after 2 seconds
    }, 2000);
}

// Checkbox logic
function handlecheckboxchange() {
    checkcount = 0;
    // Count how many checkboxes are selected
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkcount++;
        // If checkbox is checked, increase the count
    });

    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        // Make sure password length is at least equal to selected options
        sliderhander();
        // Update UI
    }
}

// Attach checkbox listeners
allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckboxchange);
    // React to changes in checkbox states
});

// Handle slider input
inputslider.addEventListener('input', (e) => {
    passwordlength = parseInt(e.target.value);
    sliderhander();
    // Update password length and UI when slider is moved
});

// Copy to clipboard when copy button is clicked
copybutton.addEventListener('click', () => {
    if (passworddisplay.value) {
        copycontent();
        // Copy password only if it exists
    }
});

// Generate password logic
generatebutton.addEventListener('click', () => {
    if (checkcount <= 0) return;
    // Do nothing if no checkbox is selected

    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        // Ensure password length is not less than selected types
        sliderhander();
    }

    password = "";
    // Clear previous password

    const funcArr = [];
    if (uppercasecheck.checked) funcArr.push(generateuppercase);
    if (lowercasecheck.checked) funcArr.push(generatelowercase);
    if (numbercheck.checked) funcArr.push(generaterandomnumber);
    if (symbolcheck.checked) funcArr.push(generatesymbol);
    // Add selected generators to array

    // Add one character from each selected type
    funcArr.forEach(func => {
        password += func();
    });

    // Fill the remaining characters randomly
    for (let i = funcArr.length; i < passwordlength; i++) {
        let randIndex = getrandominteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    // Show the password in the input field
    passworddisplay.value = password;
});

// Initialize the slider on page load
sliderhander();

