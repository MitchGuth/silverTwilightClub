let urlAPI = "http://127.0.0.1:5000";

let login = loginInfo => {
    console.log(loginInfo)
    postPromise = fetch(urlAPI, 
        {
            method: "post",
            headers: {'content-type':'application/json'},
            body: JSON.stringify(loginInfo)
        }
    );
    postPromise.catch(e => {
        console.log(e.message);
    });
    postPromise.then(
        function(response) {
            console.log(response);
        });
}

let clickLogin = event => {
    event.preventDefault();
    let emailAddress = document.querySelector('[name="emailAddress"]');
    let password = document.querySelector('[name="password"]');
    let loginInfo = {
        'emailAddress': emailAddress.value,
        'password': password.value
    };
    console.log(loginInfo);
    login(loginInfo);
};

let submitButtton = document.querySelector('.btn');
submitButtton.addEventListener('click', clickLogin);