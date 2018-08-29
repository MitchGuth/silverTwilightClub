let urlAPI = "http://127.0.0.1:5000/";
let token = localStorage.getItem('silvertwilight');

let firstLoginButton = document.querySelector('.login-btn');
let accountButtton = document.querySelector('.account-btn');
let submitLoginButton = document.querySelector('.submit-login-btn');
let submitAccountButton = document.querySelector('.submit-account-btn');
// Select pages to hide or show
let landingPage = document.querySelector('.landing-page');
let loginPage = document.querySelector('.login-page');
let accountPage = document.querySelector('.account-page');
let enterPage = document.querySelector('.enter-page');

let submitLogin = loginInfo => {
    console.log('working')
    postPromise = fetch(`${urlAPI}login`, 
        {
            method: "post",
            // mode: "no-cors",
            headers: {'content-type':'application/json'},
            body: JSON.stringify(loginInfo)
        });
    postPromise.catch(e => {
        console.log(e.message);
    });
    // console.log(postPromise);
    postPromise.then(function(response) {
        response.text().then(function(text) {
            if (text === "LOGIN FAIL") {
                // do something in the DOM and say "You suck."
                console.log("bok bok bok");
            } else {
                console.log('Storing Your Token...');
                localStorage.setItem('silvertwilight', text);
                loginPage.classList.toggle('hidden');
                enterPage.classList.toggle('hidden');
            }
        });
    });
};

let captureLoginInfo = event => {
    event.preventDefault();
    let email = document.querySelector('[name="email"]');
    let password = document.querySelector('[name="password"]');
    let loginInfo = {
        'email': email.value,
        'password': password.value
    };
    submitLogin(loginInfo);
};

let showLoginPage = event => {
    event.preventDefault();
    if (token) {
        enterPage.classList.toggle('hidden');
    } else {
        landingPage.classList.toggle('hidden');
        loginPage.classList.toggle('hidden');
    }
};


let submitAccount = accountInfo => {
    postPromise = fetch(`${urlAPI}createUser`, 
        {
            method: "post",
            // mode: "no-cors",
            headers: {'content-type':'application/json'},
            body: JSON.stringify(accountInfo)
        });
    postPromise.catch(e => {
        console.log(e.message);
    });
    // console.log(postPromise);
    postPromise.then(function(response) {
        response.text().then(function(text) {
            if (text === "ACCOUNT CREATION FAIL") {
                // do something in the DOM and say "You suck."
                console.log("bok bok bok");
            } else {
                console.log('Storing Your Token...');
                localStorage.setItem('silvertwilight', text);
                accountPage.classList.toggle('hidden');
                enterPage.classList.toggle('hidden');
            }
        });
    });
};

let captureAccountInfo = event => {
    event.preventDefault();
    let email = document.querySelector('[name="account-email"]');
    let password = document.querySelector('[name="account-password"]');
    let name = document.querySelector('[name="account-name"]');
    let accountInfo = {
        'email': email.value,
        'password': password.value,
        'name': name.value
    };
    submitAccount(accountInfo);
};

let showAccountPage = event => {
    event.preventDefault();
    landingPage.classList.toggle('hidden');
    accountPage.classList.toggle('hidden');
};

firstLoginButton.addEventListener('click', showLoginPage);
accountButtton.addEventListener('click', showAccountPage);
submitLoginButton.addEventListener('click', captureLoginInfo);
submitAccountButton.addEventListener('click', captureAccountInfo);
// enterButton.addEventListener('click', getStats);
