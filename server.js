const express = require('express');
const pg = require('pg-promise')();
const jwt = require('jsonwebtoken');
const signature = process.env.JWTSECRET;
const server = express();
const dbCongfig = 'postgres://nyarlathotep@localhost:5432/silvertwilight';
const db = pg(dbCongfig);


let readBody = (req, callback) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(body);
    });
};

let getStats = (req, res) => {
    let userId = req.user.userId;
    db.one(`select power, money from st_user_stat where user_id = '${userId}';`)
    .then(userStats => {
        res.send(userStats);
    });
}

let doLogin = (req, res) => {
    readBody(req, (body) => {
        let loginInfo = JSON.parse(body);
        console.log(loginInfo)
        db.one("select id, password from st_players where email = '" + loginInfo.email + "';")
        .then(playerInfo => {
            if (loginInfo.password === playerInfo.password) {
                let token = jwt.sign(
                    { userId: playerInfo.id },
                    signature,
                    { expiresIn: '7d'}
                );
                console.log('Creating token for ' + playerInfo.id + ' /n ' + token);
                res.end(token);
            }
            else {
                res.end('LOGIN FAIL');
            }
        })
        .catch(function(error) {
            console.log('The login process has failed. ' +error );
            res.end('LOGIN FAIL');
        });
    });
}

let validateToken = (req, res, next) => {
    let token = req.query.token;
    let isValid = false;
    let payload;
    try {
        payload = jwt.verify(token, signature)
        isValid = true;
    } catch (err) {
        isValid = false;
    };
    if (isValid) {
        req.user = payload;
        next();
    } else {
        res.end('LOGIN FAIL');
    }
};

let serverInfo = (req, res, next) => {
    res.end('You have hit the API server but you did not use a valid endpoint, or supply valid tokens. Buh bye.')
}

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.get(('/stats/'), validateToken, getStats);
server.post('/login', doLogin);
server.get('/', serverInfo);

console.log('Server listening on http://localhost:5000');
server.listen(5000);