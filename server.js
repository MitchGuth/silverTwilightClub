const express = require('express');
const pg = require('pg-promise')();
const jwt = require('jsonwebtoken');
const signature = process.env.JWTSECRET;
const db_user = process.env.DB_USER
const server = express();
const dbCongfig = `postgres://${db_user}@localhost:5432/silvertwilight`;
const db = pg(dbCongfig);

// make me resilient to empty body
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
    // req.user is set by validateToken
    let userId = req.user.userId;
    db.one(`SELECT st_player.id, 
    st_player.name, st_player_stat.power, 
    st_player_stat.money 
    FROM st_player 
    INNER JOIN st_player_stat 
    ON st_player.id = st_player_stat.user_id WHERE st_player.id=${userId}`)
    .then(userStats => {
        res.send(userStats);
    })
    .catch(function(error) {
        console.log('Error fetching stats: ' + userId);
        console.log(error);
        res.send('STATS FAIL');
    });
};

let getNews = (req, res) => {
    let userId = req.user.userId;
    db.many(`SELECT description FROM st_news WHERE user_id = ${userId}
    ORDER BY timestamp DESC
    LIMIT 2;`)
    .then(userNews => {
        console.log(userNews);
        res.end(JSON.stringify(userNews));
    })
    .catch(function(error) {
        console.log('Error fetching news: ' + userId);
        console.log(error);
        res.end('FAIL');
    });
};

let checkQueue = (req, res) => {
    // req.user is set by validateToken
    let userId = req.user.userId;
    db.many(`SELECT *
    FROM st_money_queue
    INNER JOIN st_power_queue
    ON st_money_queue.user_id = st_power_queue.user_id
    WHERE st_money_queue.user_id = ${userId};`)
    .then(userActions => {
        console.log('User has scheduled actions already: ' + userId);
        res.send(userActions);
    })
    .catch(function(error) {
        console.log('Error fetching queue for: ' + userId);
        console.log(error);
        res.end('QUEUE FAIL');
    });
};

let createUser = (req,res) => {
    readBody(req, (body) => {
        let createInfo = JSON.parse(body);
        let myID;
        db.none(`INSERT INTO st_player(name, email, password)
        VALUES ('${createInfo.name}','${createInfo.email}','${createInfo.password}');`)
        .then( () => {
            console.log('I inserted things.');
            db.one(`SELECT id FROM st_player WHERE email = '${createInfo.email}';`)
            .then (playerID => {
                myID = playerID.id;
                console.log("Player ID is: " + myID);
                    db.none(`INSERT INTO st_player_stat(user_id, power, money) VALUES (${playerID.id},10,1000);`)
                    .then( () => {
                        console.log("Player given ID and default stats");
                        res.end('SUCCESS');
                    })
                    .catch(e => {
                        console.log('FAIL');
                        console.log(e);
                    })
            })
            .catch(e => {
                console.log('FAIL');
                console.log(e);
            })
        })
        .catch(e => {
            console.log('FAIL');
            console.log(e);
        });
        
    });
};

let createAction = (req, res) => {
    let userId = req.user.userId;
    readBody(req, (body) => {
        let action = JSON.parse(body);
        console.log(action);
        // this is where to add code to run an parse/insert based on the action ID.
        // the below is hard coded for Company action.
        db.none(`INSERT INTO st_money_queue(action_id, user_id, company_id, bid_amount) VALUES
        (${action.money.actionId},${userId},${action.money.company},${action.money.bid});`)
        .then( ()=> {
            db.none(`INSERT INTO st_power_queue(action_id, user_id, venue_id, strategy_id) VALUES
            (${action.power.actionId},${userId},${action.power.venue},${action.power.strategy});`);
        })
        .catch(error => {
            console.log('Action insertion error' + error);
            res.end('FAIL');
        })
        res.end('SUCCESS');
    });
}

let doLogin = (req, res) => {
    readBody(req, (body) => {
        let loginInfo = JSON.parse(body);
        console.log(loginInfo)
        db.one("select id, password from st_player where email = '" + loginInfo.email + "';")
        .then(playerInfo => {
            if (loginInfo.password === playerInfo.password) {
                let token = jwt.sign(
                    { userId: playerInfo.id },
                    signature,
                    { expiresIn: '2d'}
                );
                console.log('Creating token for ' + playerInfo.id);
                res.end(token);
            }
            else {
                res.end('LOGIN FAIL');
            }
        })
        .catch(function(error) {
            console.log('The login process has failed:');
            console.log(error);
            res.end('LOGIN FAIL');
        });
    });
}

let companyList = (req, res, next) => {
    db.any('SELECT id, name, min_cost FROM st_company;')
    .then(function(data) {
        res.end(JSON.stringify(data));
    })
    .catch(function(e) {
        console.log("Splode: " + e);
    });
}

let venueList = (req, res, next) => {
    db.any('SELECT id, location FROM st_venue;')
    .then(function(data) {
        res.end(JSON.stringify(data));
    })
    .catch(function(e) {
        console.log("Splode: " + e);
    });
}

let stratList = (req, res, next) => {
    db.any('SELECT id, strategy FROM st_strategy;')
    .then(function(data) {
        res.end(JSON.stringify(data));
    })
    .catch(function(e) {
        console.log("Splode: " + e);
    });
}

let getScorecard = (req, res, next) => {
    db.any(`SELECT st_player.name, st_player_stat.money, st_player_stat.power
        FROM st_player_stat
        INNER JOIN st_player
        ON st_player_stat.id = st_player.id
        ORDER BY st_player_stat.money DESC;`)
    .then(function(data) {
        res.end(JSON.stringify(data));
    })
    .catch(function(e) {
        console.log("Splode: " + e);
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
};

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.get('/stats/', validateToken, getStats);
server.get('/news/', validateToken, getNews);
server.get('/checkQueue/', validateToken, checkQueue);
server.get('/companyList/', validateToken, companyList);
server.get('/venueList/', validateToken, venueList);
server.get('/stratList/', validateToken, stratList);
server.get('/scorecard/', getScorecard);
server.post('/login', doLogin);
server.post('/createUser', createUser);
server.post('/createAction/', validateToken, createAction);
server.get('/', serverInfo);


console.log('Server listening on http://localhost:5000');
server.listen(5000);