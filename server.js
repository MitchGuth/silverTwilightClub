const express = require('express');
const jwt = require('jsonwebtoken');
const signature = '1mm@_s3cr3t';
let server = express();


let users = [
    { userId: 1,
    power: 10,
    money: 100,
    name: 'Nat',
    email: 'nat@natsharpe.com',
    password: 'mellon' },
    { userId: 2,
    power: 30,
    money: 1400,
    name: 'Joe',
    email: 'joe@bigboss.com',
    password: 'riddle' },
    { userId: 3,
    power: 20,
    money: 3000,
    name: 'Kirk',
    email: 'kirk@electric.com',
    password: 'fishy' }
];

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
    let userStats = users.filter(user => userId == user.userId);
    res.send(JSON.stringify(userStats));
}

let createToken = (req, res) => {
    readBody(req, (body) => {
        let loginInfo = JSON.parse(body);
        let email = loginInfo.email;
        let password = loginInfo.password;
        let thisUser = users.find(user => email === user.email);
        if (thisUser && password === thisUser.password) {
            let token = jwt.sign(
                { userId: thisUser.userId },
                signature,
                { expiresIn: '7d'}
            );
            res.send(token);
        }
        else {
            res.end("You must create an account");
        }

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