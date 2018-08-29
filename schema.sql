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

CREATE TABLE st_bid (
    id SERIAL PRIMARY KEY,
    comapny_id INTEGER REFERENCES st_company(id),
    amount varchar(200) NOT NULL
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
