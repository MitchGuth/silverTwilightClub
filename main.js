let urlAPI = "http://127.0.0.1:5000/";

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
            console.log('Storing Your Token...');
            localStorage.setItem('silvertwilight', text);
          });
    });
}

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

let submitButtton = document.querySelector('.btn');
submitButtton.addEventListener('click', clickLogin);