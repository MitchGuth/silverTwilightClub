const pg = require('pg-promise')();
const signature = process.env.JWTSECRET;
const db_user = process.env.DB_USER
const dbCongfig = `postgres://${db_user}@localhost:5432/silvertwilight`;
const db = pg(dbCongfig);

let processCompanyQueue = () => {
    db.any('SELECT id, name, min_cost, chance FROM st_company')
    .then(function(companyList) {
        for (let company of companyList) {
            console.log(company.id);
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