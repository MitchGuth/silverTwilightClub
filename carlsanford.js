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
                let bonusAmount = highbid.bid_amount * ((roll * .01) + 1 );
                bonusCash = highbid.bid_amount + bonusAmount;
                console.log('You WIN' + bonusCash);
                adjustedCash = adjustedCash + bonusCash;
            } else {
                console.log('No dice.'); 
            }
            console.log(`UPDATE st_player_stat SET money=${adjustedCash} where user_id=${highbid.user_id}`);
            db.none(`UPDATE st_player_stat SET money=${adjustedCash} where user_id=${highbid.user_id}`)
            .then(function() {
                let description = `You won the auction, and paid $${highbid.bid_amount} for ${highbid.name}, which profited $${bonusCash} after the sale.`;
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
            // db.one(`SELECT user_id, bid_amount, company_id FROM 
            //     st_money_queue WHERE bid_amount = (select max(bid_amount) 
            //     FROM st_money_queue where company_id = ${company.company_id} LIMIT 1);`)
            db.one(`SELECT st_money_queue.user_id, st_money_queue.bid_amount, st_money_queue.company_id, 
            st_company.id, st_company.name 
            FROM st_money_queue 
            INNER JOIN st_company
            ON st_money_queue.company_id = st_company.id
            WHERE st_money_queue.bid_amount = (SELECT max(st_money_queue.bid_amount) FROM st_money_queue WHERE st_money_queue.company_id = ${company.company_id})
            LIMIT 1;`)
            .then( function(highbid) {
                console.log(`User ${highbid.user_id} has the highest bid of ${highbid.bid_amount} for company ${highbid.name}`);
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
    console.log('Skippig bid losers for now...');
}

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
            let resultMsg;
            let roll = Math.floor(Math.random() * 101);
            let adjustedPower = 0;
            console.log(`User ${action.user_id} attempts ${action.strategy_name} at ${action.location_name} and rolled ${roll}.`);
            if (action.user_strategy === action.bonus_strategy) {
                console.log('strategy match bonus engaged');
                chance = 40;
            }
            console.log('Chance is: ' + chance);
            if (roll <= chance) {
                resultMsg = `Excellent! Your attempt to use ${action.strategy_name} at ${action.location_name} was a success and you have gained power.`;
                adjustedPower = action.power + 1;
                console.log(resultMsg + " " + adjustedPower);
            } else if (roll == 100) {
                resultMsg = `Catastrophe! Your attempt to use ${action.strategy_name} at ${action.location_name} was an utter failure and you have lost some power.`;
                adjustedPower = action.power -1;
                console.log(resultMsg + " " + adjustedPower);
            } else {
                resultMsg = `Your attempt to use ${action.strategy_name} at ${action.location_name} went unnoticed by those present and did not gain you any more power. Better luck next time.`;
                adjustedPower = action.power;
                console.log(resultMsg + " " + adjustedPower); 
            }
            db.none(`INSERT INTO st_news (timestamp, user_id, description)
                VALUES (current_timestamp, ${action.user_id}, '${resultMsg}');`);
            db.none(`UPDATE st_player_stat SET power = ${adjustedPower} WHERE user_id = ${action.user_id}`);
        }
    })
}

// -------------------- MAIN BLOCK
//MONEY action 1
processCompanyQueueWinner();
processCompanyQueueLoser();
//POWER action 1
processPowerQueue();