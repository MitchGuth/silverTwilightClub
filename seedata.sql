INSERT INTO st_player ( id, name, email, password ) VALUES
(1, 'Lord Kensington', 'blarg@sect.net', 'explode123'),
(2, 'Tribeca Clarette', 'zombie@sect.net', 'apples123'),
(3, 'Kerrylon Varnish', 'monkey@sect.net', 'superduper2'),
(4, 'Fontleroy Devonshire', 'dargfark@sect.net', 'noonygargar'),
(5, 'Reptilicus Voortman', 'idiot@sect.net', 'jarjarbinks4evr');

INSERT INTO st_player_stat (user_id, power, money) VALUES
(1, 10, 1000),
(2, 9, 2000),
(3, 8, 0),
(4, 0, 4000),
(5, 10, 5000);

INSERT INTO st_company (id, name, min_cost, chance) VALUES
(1, 'Crankstaff Amalgamated', 400, 10),
(2, 'Doylycott Napkins Ltd.', 400, 20),
(3, 'P.C. Norris, LTD', 400, 30),
(4, 'Tango Cash Mechanica', 600, 40);

INSERT INTO st_venue (id, location, bonusStrategies) VALUES
(1, 'The Majestic Ballroom', 2),
(2, 'St. Charles Cathedral', 1),
(3, 'City Hall', 3),
(4, 'Broom Closet Boozery', 4);

INSERT INTO st_strategy (id, strategy) VALUES
(1, 'Intimidate'),
(2, 'Seduce'),
(3, 'Schmooze'),
(4, 'Life of the party');

INSERT INTO st_money_queue (action_id, user_id, company_id, bid_amount) VALUES
(1, 1, 1, 500),
(1, 2, 1, 400);

INSERT INTO st_power_queue (action_id, user_id, venue_id, strategy_id) VALUES
(1, 1, 1, 3),
(1, 2, 1, 2);
