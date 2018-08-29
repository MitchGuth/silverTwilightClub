let urlAPI = "http://127.0.0.1:5000/";
let token = localStorage.getItem('silvertwilight');


let login = loginInfo => {
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
            }
        });
    });
};

let clickLogin = event => {
    event.preventDefault();
    let emailAddress = document.querySelector('[name="emailAddress"]');
    let password = document.querySelector('[name="password"]');
    let loginInfo = {
        'email': emailAddress.value,
        'password': password.value
    };
    login(loginInfo);
};

let clickFirstLogin = event => {
    let landingPage = document.querySelector('.landing-page');
    let loginPage = document.querySelector('.login-page');
    event.preventDefault();
    if (token) {
        // run getStats function
    } else {
        landingPage.classList.toggle('hidden');
        loginPage.classList.toggle('hidden');
    }
};

let firstLoginButtton = document.querySelector('.login-btn');
let accountButtton = document.querySelector('.account-btn');
let loginButtton = document.querySelector('.submit-btn');

firstLoginButtton.addEventListener('click', clickFirstLogin);
// accountButtton.addEventListener('click', clickAccount);
loginButtton.addEventListener('click', clickLogin);