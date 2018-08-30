CREATE TABLE st_player (
    id SERIAL PRIMARY KEY,
    name  varchar(200) NOT NULL,
    email varchar(200) UNIQUE NOT NULL,
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
    min_cost INTEGER NOT NULL,
    chance varchar(200) NOT NULL
);

CREATE TABLE st_venue (
    id SERIAL PRIMARY KEY,
    location varchar(200) NOT NULL,
    bonusStrategies varchar(200) NOT NULL
);

CREATE TABLE st_strategy (
    id INTEGER PRIMARY KEY,
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

CREATE TABLE st_news (
    user_id INTEGER REFERENCES st_player(id),
    description varchar(255)
);