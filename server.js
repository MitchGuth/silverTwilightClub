const express = require('express');
const pg = require('pg-promise')();
const jwt = require('jsonwebtoken');
const signature = process.env.JWTSECRET;
const server = express();
const dbCongfig = 'postgres://nat@localhost:5432/silvertwilight';
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

let createToken = (req, res) => {
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
                res.send(token);
            }
            else {
                res.end("You must create an account");
            }
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
        res.end("BEGONE YOU FILTHY PEASANT!");
    }
};

server.get(('/stats/'), validateToken, getStats);
server.post('/login', createToken);

server.listen(5000);