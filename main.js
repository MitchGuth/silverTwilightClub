let urlAPI = "http://127.0.0.1:3000";

let submitButtton = document.querySelector('.btn');

let login = loginInfo => {
    let getStatsPromise = fetch((urlAPI + '/login' + loginInfo.emailAddress + '&' + loginInfo.emailAddress), {
        method: 'post'
    });
    getStatsPromise.then((response) => {
        let toJSONPromise = response.json();
        toJSONPromise.then((stats) => {
            console.log(stats);
        });
    });
};

let clickLogin = event => {
    event.preventDefault();
    let emailAddress = document.querySelector('[name="emailAddress"]');
    let password = document.querySelector('[name="password"]');
    let loginInfo = {
        'emailAddress': emailAddress.value,
        'password': password.value
    };
    login(loginInfo);
};

// save token in local storage
// logout button would clear the token from local stroage

submitButtton.addEventListener('click', login);