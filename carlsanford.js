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
    console.log('All your base are belong to us.');
}

let processCompanyQueueReset = function() {

}
// 	evaluate losers:
// 		select all bids where company and min bid
// 		remove ( bid *.25 ) : remove 1 power & news

// -------------------- MAIN BLOCK
//action 1
processCompanyQueueWinner();
processCompanyQueueLoser();
processCompanyQueueReset();