CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    name  varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    password varchar(200) NOT NULL
);

CREATE TABLE user_stat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    power varchar(200) NOT NULL,
    money varchar(200) NOT NULL
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name varchar(200) NOT NULL,
    min_cost varchar(200) NOT NULL,
    chance varchar(200) NOT NULL
);

CREATE TABLE bid (
    id SERIAL PRIMARY KEY,
    comapny_id INTEGER REFERENCES company(id),
    amount varchar(200) NOT NULL
);