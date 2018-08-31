const pg = require('pg-promise')();
const db_user = process.env.DB_USER
const dbCongfig = `postgres://${db_user}@localhost:5432/silvertwilight`;
const db = pg(dbCongfig);

let doBidWinner = function(highbid) {
    let adjustedCash;
    db.one(`SELECT money FROM st_player_stat WHERE user_id= ${highbid.user_id};`)
    .then(function(playerCash) {
        adjustedCash = playerCash.money - highbid.bid_amount;
        console.log("User: " + highbid.user_id + " now has " + adjustedCash);
        return adjustedCash;
    })
    .then(function(adjustedCash) {
        let bonusCash = 0;
        let roll = Math.floor(Math.random() * 101);
        db.one(`SELECT chance FROM st_company WHERE id = ${highbid.company_id};`)
        .then(function (chance) { 
            console.log(`Rolled ${roll} and a chance of ${chance.chance}`);
            if (roll <= chance.chance) {
                let bonusAmount = highbid.bid_amount * roll;
                bonusCash = highbid.bid_amount + bonusAmount;
                console.log('You WIN' + bonusCash);
                adjustedCash = adjustedCash + bonusCash;
            } else {
                console.log('No dice.'); 
            }
            console.log(`UPDATE st_player_stat SET money=${adjustedCash} where user_id=${highbid.user_id}`);
            db.none(`UPDATE st_player_stat SET money=${adjustedCash} where user_id=${highbid.user_id}`)
            .then(function() {
                let description = `You bid ${highbid.bid_amount} on company ${highbid.company_id} and won. You made ${adjustedCash}`;
                db.none(`INSERT INTO st_news (timestamp, user_id, description)
                VALUES (current_timestamp, ${highbid.user_id}, '${description}');`);
            })
            .catch(error => {
                console.log('Your plans are laid to waste: ' + error);
            })
        })
    })
    .catch(error => {
        console.log('Catastrophe ' + error);
    })
}

let processCompanyQueueWinner = function() {
    // only do this for companies we know are in the queue
    db.any('SELECT DISTINCT company_id FROM st_money_queue;')
    .then(function(companyIDList) {
        for (let company of companyIDList) {
            db.one(`SELECT user_id, bid_amount, company_id FROM 
                st_money_queue WHERE bid_amount = (select max(bid_amount) 
                FROM st_money_queue where company_id = ${company.company_id} LIMIT 1);`)
            .then( function(highbid) {
                console.log(`User ${highbid.user_id} has the highest bid of ${highbid.bid_amount} for company ${highbid.company_id}`);
                doBidWinner(highbid);
            })
            .catch(error => {
                console.log('Devastation: ' + error);
            })
            console.log
        }
        })
    .catch(error => {
        console.log('Company Processing Error or empty queue');
        console.log(error);
    })
}

let processCompanyQueueLoser = function() {
// 	evaluate losers:
// 		select all bids where company and min bid
// 		remove ( bid *.25 ) : remove 1 power & news
    console.log('All your base are belong to us.');
}

let processCompanyQueueReset = function() {
    console.log(`DELETE FROM st_money_queue;`);
}

// [ { user_id: 1,
//     user_venue: 1,
//     user_strategy: 3,
//     strategy_name: 'Schmooze',
//     location_name: 'The Majestic Ballroom',
//     power: 10,
//     bonus_strategy: 2 },
//   { user_id: 2,
//     user_venue: 1,
//     user_strategy: 2,
//     power: 9,
//     strategy_name: 'Seduce',
//     location_name: 'The Majestic Ballroom',
//     bonus_strategy: 2 } ]
let processPowerQueue = function() {
    db.any(`SELECT st_power_queue.user_id,
    st_power_queue.venue_id AS user_venue,
    st_power_queue.strategy_id AS user_strategy,
    st_strategy.strategy AS strategy_name,
    st_venue.location AS location_name,
    st_venue.bonus_strategy,
    st_player_stat.power
    FROM st_power_queue
    INNER JOIN st_strategy
    ON st_power_queue.strategy_id = st_strategy.id
    INNER JOIN st_venue
    ON st_power_queue.venue_id = st_venue.id
    INNER JOIN st_player_stat
    ON st_player_stat.user_id = st_power_queue.user_id;`)
    .then(function (powerData) {
        console.log('Processing power actions...');
        for (let action of powerData) {
            var chance = 30;
            let roll = Math.floor(Math.random() * 101);
            console.log(`User ${action.user_id} attempts ${action.strategy_name} at ${action.location_name} and rolled ${roll}.`);
            if (action.user_strategy === action.bonus_strategy) {
                console.log('strategy match bonus engaged');
                chance = 40;
            }
            if (roll <= chance) {
                resultMsg = "Success! You managed the proper stratagem and have gained more influence."
                console.log(resultMsg);
            } else if (roll == 100) {
                resultMsg = "Catastrophe! Things were going so well, but then: You made massive miscalculation and committed a social blunder in front of some powerful people."
                console.log(resultMsg);
            } else {
                resultMsg = 'You did your best, but nobody was paying attention to your social machinations. You gain no power.';
                console.log(resultMsg); 
            }
        }
    })
}
// Then:
// chance = 30%
// IF data.bonus === strategy_id then: chance = 40%, headline=true
// Roll.

// if roll <= chance player += 1 power, outcome= "Success! You managed the proper stratagem and have gained more influence."

// else if roll == 1 player -= 1 power, outcome="Things were going so well, but then: You made a fool of yourself in front of some powerful people."

// add news:
// if headline news = You attended the event at $location and were exceptional at applying your skill in $strategy_name. $outcome.
// else news = You attended the event at $location and tried your skill with $strategy_name. $outcome"

// -------------------- MAIN BLOCK
//MONEY action 1
processCompanyQueueWinner();
processCompanyQueueLoser();
processCompanyQueueReset();
//POWER action 1
processPowerQueue();