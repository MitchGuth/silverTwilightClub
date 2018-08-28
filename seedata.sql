INSERT INTO st_players ( id, name, email, password ) VALUES
(1, 'Lord Kensington', 'blarg@sect.net', 'explode123'),
(2, 'Tribeca Clarette', 'zobie@sect.net', 'apples123'),
(3, 'Kerrylon Varnish', 'notzobie@sect.net', 'vavavoom6433'),
(4, 'Fontleroy Devonshire', 'dargfark@sect.net', 'noonygargar'),
(5, 'Reptilicus Voortman', 'chum@sect.net', 'jarjarbinks123');

INSERT INTO st_user_stat (user_id, power, money) VALUES
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

INSERT INTO venue (id, location, bonusStrategies) VALUES
(1, 'The Majestic Ballroom', 'Seduce'),
(2, 'St. Charles Cathedral', 'Intimidate'),
(3, 'City Hall', 'Schmooze'),
(4, 'Broom Closet Boozery', 'Life of the Party')

INSERT INTO strategies (id, strategy) VALUES
(1, 'Intimidate'),
(2, 'Seduce'),
(3, 'Schmooze'),
(4, 'Life of the party')