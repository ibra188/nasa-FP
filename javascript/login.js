// this code was written only as an example of how functional programming works
// written by Danijel Adrinek
let serverData;
const username = document.getElementById('username');
const password = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const submit = document.getElementById('submit');


(async function getServerData() {
    serverData = await fetch('./data/data.json');
    serverData = await serverData.json();
})();

function validate() {
    const inputs = takeInputs();
    const validationComplete = validateUsernameAndPassword(inputs);
    if(validationComplete.type === 'valid') {
        loginUser(validationComplete.response);
    } else {
        loginUser(validationComplete.response)
    }
}

function takeInputs() {
    const usernameInput = username.value;
    const passwordInput = password.value;
    return [usernameInput, passwordInput];
}

function validateUsernameAndPassword(usernameAndPasswordArray) {
    removeErrors()

    const username = usernameAndPasswordArray[0];
    const password = usernameAndPasswordArray[1];
    const errors = [];

    // checking if the username and password are empty
    if(username != '' && password != '') {
        for(user in serverData) {
            console.log(serverData[user].password);
            // checking if the username and password match any from the server
            if(username === serverData[user].name) {
                if(password === serverData[user].password) {
                    return {
                        type: 'valid',
                        response: username
                    };
                }
                errors.push('Invalid password!')
                return {
                    type: 'error',
                    response: errors
                };
            }
        }
        errors.push('Invalid username!');
        return {
            type: 'error',
            response: errors
        };
    
    } else {
        // if username or password was empty, check which one it was and push to errors array
        if(username == '') {
            errors.push('please enter username!');
        }
        if(password == '') {
            errors.push('please enter password!');
        }
        
        return {
            type: 'error',
            response: errors
        };
    }
}

function removeErrors() {
    const errors = document.getElementsByClassName('error');
    const errorsArray = Object.values(errors);

    errorsArray.forEach(function(error) {
        error.style.display = 'none';
    });
}

function loginFailed(err) {
    err.map(displayErrors);
}

function displayErrors(err) {
    switch(err) {
        case 'Invalid password!':
            showErrorMessage(passwordError, err);
            break;
        case 'Invalid username!':
            showErrorMessage(usernameError, err);
            break;
        case 'please enter username!':
            showErrorMessage(usernameError, err);
            break;
        default:
            showErrorMessage(passwordError, err);
    }
}

function showErrorMessage(errorElement, text) {
    errorElement.innerText = text;
    errorElement.style.display = "block";
}

// for this example we will need only the role to work with
function loginUser(username) {
    sessionStorage.setItem('role', username);
    window.location.href = "http://127.0.0.1:5500/real%20programming/JS/projects%20to%20show%20off/FP/content.html";
}