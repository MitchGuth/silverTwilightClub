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

let login = loginInfo => {
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

let createAccount = accountInfo => {
    postPromise = fetch(`${urlAPI}account`, 
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

let clickSubmitLogin = event => {
    event.preventDefault();
    let email = document.querySelector('[name="email"]');
    let password = document.querySelector('[name="password"]');
    let loginInfo = {
        'email': email.value,
        'password': password.value
    };
    login(loginInfo);
};

let clickFirstLogin = event => {
    event.preventDefault();
    if (token) {
        enterPage.classList.toggle('hidden');
    } else {
        landingPage.classList.toggle('hidden');
        loginPage.classList.toggle('hidden');
    }
};

let clickSubmitAccount = event => {
    event.preventDefault();
    let email = document.querySelector('[name="account-email"]');
    let password = document.querySelector('[name="account-password"]');
    let name = document.querySelector('[name="account-name"]');
    let accountInfo = {
        'account-email': email.value,
        'account-password': password.value,
        'account-name': name.value
    };
    createAccount(accountInfo);
};

let clickAccount = event => {
    event.preventDefault();
    landingPage.classList.toggle('hidden');
    accountPage.classList.toggle('hidden');
};

firstLoginButton.addEventListener('click', clickFirstLogin);
accountButtton.addEventListener('click', clickAccount);
submitLoginButton.addEventListener('click', clickSubmitLogin);
submitAccountButton.addEventListener('click', clickSubmitAccount);
// enterButton.addEventListener('click', getStats);
