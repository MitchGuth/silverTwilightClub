CREATE TABLE st_player (
    id SERIAL PRIMARY KEY,
    name  varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    password varchar(200) NOT NULL
);

CREATE TABLE st_player_stat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES st_player(id),
    power varchar(200) NOT NULL,
    money varchar(200) NOT NULL
);

CREATE TABLE st_company (
    id SERIAL PRIMARY KEY,
    name varchar(200) NOT NULL,
    min_cost varchar(200) NOT NULL,
    chance varchar(200) NOT NULL
);

CREATE TABLE st_venue (
    id SERIAL PRIMARY KEY,
    location varchar(200) NOT NULL,
    bonusStrategies varchar(200) NOT NULL
);

CREATE TABLE st_strategy (
    id SERIAL PRIMARY KEY,
    strategy varchar(200) NOT NULL
);

CREATE TABLE st_money_queue (
    action_id  INTEGER,
    user_id INTEGER REFERENCES st_player(id),
    company_id INTEGER,
    bid_amount INTEGER 
);

CREATE TABLE st_power_queue (
    action_id INTEGER,
    user_id INTEGER REFERENCES st_player(id),
    venue_id INTEGER,
    strategy_id INTEGER 
);

SELECT *
FROM st_money_queue
INNER JOIN st_power_queue
ON st_money_queue.user_id = st_power_queue.user_id
WHERE st_money_queue.user_id = 1;