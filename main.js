let urlAPI = "http://127.0.0.1:5000/";
let token = localStorage.getItem('silvertwilight');

let firstLoginButton = document.querySelector('.login-btn');
let accountButtton = document.querySelector('.account-btn');
let submitLoginButton = document.querySelector('.submit-login-btn');
let submitAccountButton = document.querySelector('.submit-account-btn');
let enterButton = document.querySelector('.enter-btn');
let submitActionButton = document.querySelector('.submit-action-btn');

// Select pages to hide or show
let landingPage = document.querySelector('.landing-page');
let loginPage = document.querySelector('.login-page');
let accountPage = document.querySelector('.account-page');
let enterPage = document.querySelector('.enter-page');
let gamePage = document.querySelector('.game-page');
let money;
let companiesAndPrices = {};

let retrieveStats = () => {
    let currentMoney = document.querySelector('.current-money');
    let currentPower = document.querySelector('.current-power');
    getPromise = fetch(`${urlAPI}stats/?token=${token}`);
    getPromise.catch(e => {
        console.log(e.message);
    });
    getPromise
        .then(function(response){
        //returns just the body of response
        return response.json()
        })
        .then(function(response) {
        if (response === null){
        console.log('error no stats');
        }
        else{
            currentMoney.textContent = response.money;
            currentPower.textContent = response.power;
            money = response.money;
            }
    });
};

let retrieveCompanies = () => {
    let companyList = document.querySelector('[name="companies-dropdown-menu"]'); 
    getPromise = fetch(`${urlAPI}companyList/?token=${token}`);
    getPromise.catch(e => {
        console.log(e.message);
    });
    getPromise
        .then(function(response){
        //returns just the body of response
        return response.json()
        })
        .then(function(response) {
        if (response === null){
        console.log('error no companies');
        }
        else {
            console.log(response);
            for (index = 0; index < response.length; index++) {
                let option = document.createElement("OPTION");
                let companyObject = response[index];
                let company = companyObject.name;
                let minCost = response[index].min_cost;
                option.id = `company${index}`;
                companyList.appendChild(option);
                document.getElementById(`company${index}`).text =`${company} - Min. Bid: $${minCost}`;
                document.getElementById(`company${index}`).value = companyObject['id'];
                companiesAndPrices[companyObject['id']] = minCost;
            }            
        }
    });
};

let retrieveVenues = () => {
    let venueList = document.querySelector('[name="venues-dropdown-menu"]'); 
    getPromise = fetch(`${urlAPI}venueList/?token=${token}`);
    getPromise.catch(e => {
        console.log(e.message);
    });
    getPromise
        .then(function(response){
        //returns just the body of response
        return response.json()
        })
        .then(function(response) {
        if (response === null){
        console.log('error no venues');
        }
        else {
            console.log(response);
            for (index = 0; index < response.length; index++) {
                let option = document.createElement("OPTION");
                let venueObject = response[index];
                let venue = venueObject.location;
                option.id = `venue${index}`;
                venueList.appendChild(option);
                let venueOption = document.getElementById(option.id);
                venueOption.text = `${venue}`;
                venueOption.value = `${venueObject.id}`;
            }            
        }
    });
};

let retrieveStrategies = () => {
    let strategyList = document.querySelector('[name="stratagies-dropdown-menu"]'); 
    getPromise = fetch(`${urlAPI}stratList/?token=${token}`);
    getPromise.catch(e => {
        console.log(e.message);
    });
    getPromise
        .then(function(response){
        //returns just the body of response
        return response.json()
        })
        .then(function(response) {
        if (response === null){
        console.log('error no strategies');
        }
        else {
            console.log(response);
            for (index = 0; index < response.length; index++) {
                let option = document.createElement("OPTION");
                let strategy = response[index].strategy;
                option.id = `strategy${index}`;
                strategyList.appendChild(option);
                document.getElementById(`strategy${index}`).text =`${strategy}`;
                document.getElementById(`strategy${index}`).value = response[index].id;
            }            
        }
    });
};

let writeGamePage = () => {
    enterPage.classList.toggle('hidden');
    gamePage.classList.toggle('hidden');
    retrieveStats();
    retrieveCompanies();
    retrieveVenues();
    retrieveStrategies();
};


let submitAction = actionInfo => {
    console.log(JSON.stringify(actionInfo))
    postPromise = fetch(`${urlAPI}createAction/`, 
        {
            method: "post",
            // mode: "no-cors",
            headers: {'content-type':'application/json'},
            body: JSON.stringify(actionInfo)
        });
    postPromise.catch(e => {
        console.log(e.message);
    });
    // console.log(postPromise);
    postPromise.then(() => {
        console.log('Actions Submitted');
    });
};

let captureActionInfo = event => {
    event.preventDefault();
    let moneyActionId = 1;
    let companyList = document.getElementById('company-selector'); 
    let company = companyList.options[companyList.selectedIndex]; 
    let minBid = companiesAndPrices[company.value];
    let userBid = document.querySelector('[name="bid"]');
    let powerActionId = 1;
    let venueList = document.getElementById('venue-selector'); 
    let venue = venueList.options[venueList.selectedIndex]; 
    let strategyList = document.getElementById('strategy-selector'); 
    let strategy = strategyList.options[strategyList.selectedIndex]; 
    let actionInfo = {
        money: {
            'actionId': parseInt(moneyActionId),
            'company': parseInt(company.value),
            'bid': parseInt(userBid.value)
        },
        power: {
            'actionId': parseInt(powerActionId),
            'venue': parseInt(venue.value),
            'strategy': parseInt(strategy.value)
        }
    };
    let moneyFieldEmpty = Object.values(actionInfo.money).includes(NaN);
    let powerFieldEmpty = Object.values(actionInfo.power).includes(NaN);
    if(powerFieldEmpty || moneyFieldEmpty) {
        alert("Please fill out all fields");
    } else if (minBid > parseInt(userBid.value)) {
        alert("Scoundrel, your bid is below the minimum.");
    } else if (money < parseInt(userBid.value)) {
        alert("Your bid is greater than your wallet, peasant.");
    } else {
        submitAction(actionInfo);
    }
};

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
    let fieldEmpty = Object.values(loginInfo).includes('');
    if(fieldEmpty) {
        alert("Please fill out all fields");
    } else {
        submitLogin(loginInfo);
    }
};

let showLoginPage = event => {
    event.preventDefault();
    if (token) {
        landingPage.classList.toggle('hidden');
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
    postPromise.then(() => {
        console.log('Account Created');
        accountPage.classList.toggle('hidden');
        loginPage.classList.toggle('hidden');
    });
};

let captureAccountInfo = event => {
    event.preventDefault();
    let email = document.querySelector('[name="account-email"]');
    let password1 = document.querySelector('[name="account-password-1"]');
    let password2 = document.querySelector('[name="account-password-2"]');
    let name = document.querySelector('[name="account-name"]');
    let accountInfo = {
        'email': email.value,
        'password': password1.value,
        'name': name.value
    };
    let fieldEmpty = Object.values(accountInfo).includes('');
    if(fieldEmpty) {
        alert("Please fill out all fields");
    } else if (password1.value === password2.value) {
        submitAccount(accountInfo);
    } else {
        alert("Passwords do not match.");
    }
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
enterButton.addEventListener('click', writeGamePage);
submitActionButton.addEventListener('click', captureActionInfo);
