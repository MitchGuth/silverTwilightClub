CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    name  varchar(200) NOT NULL,
    email varchar(200) NOT NULL
);

CREATE TABLE user_stat (
    id SERIAL PRIMARY KEY,
    power varchar(200) NOT NULL,
    money varchar(200) NOT NULL
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name varchar(200) NOT NULL,
    min_cost varchar(200) NOT NULL,
    change_range varchar(200) NOT NULL
);

CREATE TABLE bid (
    id SERIAL PRIMARY KEY,
    comapny_id varchar(200) NOT NULL,
    amount varchar(200) NOT NULL
);

CREATE TABLE venue (
    id SERIAL PRIMARY KEY,
    location varchar(200) NOT NULL
);

CREATE TABLE strategies (
    id SERIAL PRIMARY KEY,
    strategy varchar(200) NOT NULL
);