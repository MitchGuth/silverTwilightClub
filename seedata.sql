INSERT INTO st_player ( name, email, password ) VALUES
('Lord Kensington', 'blarg@sect.net', 'explode123'),
('Tribeca Clarette', 'zombie@sect.net', 'apples123'),
('Kerrylon Varnish', 'monkey@sect.net', 'superduper2'),
('Fontleroy Devonshire', 'dargfark@sect.net', 'noonygargar'),
('Reptilicus Voortman', 'idiot@sect.net', 'jarjarbinks4evr');

INSERT INTO st_player_stat (user_id, power, money) VALUES
(1, 10, 1000),
(2, 9, 2000),
(3, 8, 0),
(4, 0, 4000),
(5, 10, 5000);

INSERT INTO st_company (name, min_cost, chance) VALUES
('Crankstaff Amalgamated', 400, 10),
('Doyles Fine Cutlery Ltd.', 400, 20),
('Arrow Collars', 250, 30),
('US Petroleum', 5000, 25),
('Combined Steel Canada', 3000, 20),
('Henrys Pet Foods', 400, 20),
('Capones Canned Meats Co.', 800, 40),
('Winchester Rifle Corp.', 1900, 50),
('P.C. Norris, LTD', 200, 10),
('Indian Head Baking Powders', 250, 25),
('Vanderbilt Heavy Industry', 3000, 50),
('Pullman Train and Rail', 1200, 50),
('Macys Fashion Inc.', 900, 30),
('Tango Cash Mechanica', 100, 70);

INSERT INTO st_venue (location, bonus_strategy) VALUES
('The Majestic Ballroom', 2),
('St. Charles Cathedral', 12),
('City Hall', 3),
('Marians Tea Parlour', 5),
('Patricia Carlisles Poker Lounge', 13),
('The Kings And Crown Tavern', 10),
('Miskatonic University Faculty Mixer', 4),
('Whistle Stop Downs Race Track', 9),
('Capital Field Sporting Arena', 10),
('Scarlet McNairs House of Ill Repute', 11),
('Broom Closet Boozery', 6);

INSERT INTO st_strategy (id, strategy) VALUES
(1, 'Intimidate'),
(2, 'Seduce'),
(3, 'Schmooze'),
(4, 'Name Dropper'),
(5, 'Ettiquette'),
(6, 'Blackmail'),
(7, 'Threats'),
(8, 'Clown'),
(9, 'Bribery'),
(10, 'Deception'),
(11, 'Shyness'),
(12, 'Piety'),
(13, 'Life of the party');

INSERT INTO st_money_queue (action_id, user_id, company_id, bid_amount) VALUES
(1, 1, 1, 500),
(1, 3, 1, 900),
(1, 4, 2, 100),
(1, 5, 2, 200),
(1, 2, 1, 400);

INSERT INTO st_power_queue (action_id, user_id, venue_id, strategy_id) VALUES
(1, 1, 1, 3),
(1, 2, 1, 2);
