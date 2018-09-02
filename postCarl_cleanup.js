const pg = require('pg-promise')();
const db_user = process.env.DB_USER
const dbCongfig = `postgres://${db_user}@localhost:5432/silvertwilight`;
const db = pg(dbCongfig);

let processCompanyQueueReset = function() {
    console.log('Cleaning out Company Queue');
    db.none(`DELETE FROM st_money_queue;`);
}

let processPowerQueueReset = function() {
    console.log('Cleaning out power Queue');
    db.none(`DELETE FROM st_power_queue;`);
}

// MAIN ----- >
processCompanyQueueReset();
processPowerQueueReset();