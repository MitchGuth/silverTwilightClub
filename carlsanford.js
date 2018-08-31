const pg = require('pg-promise')();
const signature = process.env.JWTSECRET;
const db_user = process.env.DB_USER
const dbCongfig = `postgres://${db_user}@localhost:5432/silvertwilight`;
const db = pg(dbCongfig);

let processCompanyQueue = () => {
    // only do this for companies we know are in the queue
    db.any('SELECT DISTINCT company_id FROM st_money_queue;')
    .then(function(companyIDList) {
        for (let company of companyIDList) {
            console.log("Processing " + company.company_id);
            db.one(`SELECT user_id, bid_amount FROM 
                st_money_queue WHERE bid_amount = (select max(bid_amount) 
                FROM st_money_queue where company_id = ${company.company_id});`)
            .then( function(highbid) {
                console.log(`User ${highbid.user_id} has the highest bid of ${highbid.bid_amount} for company ${company.company_id}`);
            })
            .catch(error => {
                console.log("Oh shit.");
            })
        }
        })
    .catch(error => {
        console.log('Company Processing Error or empty queue');
        console.log(error);
    })
}
// process money action 1
// 	for each company in st_company:

// 	evaluate the winner:
// 		select all bids where company and max bid
// 		update his money stat to remove bid
// 		company has a "chance" value
// 		roll a d100:
// 			if the roll is <= chance, you made money
// 			add money (bid * 1.theroll) & add news
// 			else the roll is > chance, you lost money
// 			remove (bid * 1.theroll) & add news

// 	evaluate losers:
// 		select all bids where company and min bid
// 		remove ( bid *.25 ) : remove 1 power & news

//action 1
processCompanyQueue();