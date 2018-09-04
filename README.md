# The Silver Twilight Lodge
A strategy game of most dire import.

## Care to join us?
Carl Sanford pulls you aside. "Quite the party tonight eh? Absolutely everybody of means is here." He gestures at the ball room where men in suits sip their brandy and discuss business in hushed tones, pausing to scan the crowd with cold eyes.

"You have made an impression on some of us you know. You might have what it takes to join our club. You will find that when it comes to ruling this world, and others, nobody does it quite like we do." He smiles a sinister smile and takes a long drag on his cigar before extending a cold hand in your direction.

# How to Play

## Amass Wealth
You need to amass wealth to stay in the club. You can do this by flipping a company for a quick profit, or perhaps you will deal with the Rum Runners and risk arrest to move some bootleg hooch.

## Amass Power
It takes power, influence, and connections to rule the business world. Will you try your luck at a social soiree, or perhaps you prefer more sinister methods and will deal with the Unspeakable Nighmares that dwell, chained with cold iron, in the basement of the Club...

## Don't Lose
If your money or power reaches 0, Carl will escort you out of the club. Will you be lucky enough to simply walk out the front door? 

# About The Project
This was a class project for the three of us at Digital Crafts, in the June 2018 Cohort. The mandate was to create a "back-end heavy" project. So we convened and discussed what our ideal user would be: A gamer, genre fan, little time, likes tabletop (think pencil and paper) games.

We decided to create a game where a player can queue their commands, and then have the game "play itself" for them nightly.

Thus was born the Silver Twilight Club, an homage to HP Lovecraft and the Arkham Horror literature and games. We wrote a front end that uses plenty of Javascript to interact with the player. We wrote a RESTful API server that mediates all the interaction with the persistent data. Then we wrote Carl Sanford, a script that processes the queued actions of the players. Nathan decided to name it after the founder of the Silver Twilight, because he is a giant nerd for Lovecraft. You've probably met the type.

If you would like to run the game yourself, you totally can! Just grab the software from here and install it to your favorite nginx server. Fire up the Postgresql database with the schema and seed data, then start the server.js with your favorite process monitor. You'll probably have to change a URL or two, and set some ENV variables for things like the JWT seed but that's pretty obvious from reading the first few lines of server.js or Carl.

There are many features we had dreamed of adding. The game was a vision of perfection, but as with all projects we had a deadline so we trimmed it down to the bare bones of what we felt we could achieve in 5 days. We did it. There might have been a weekend day or two we cheated and worked a little more... to be expected because we fell in love with our own game.

Thanks for stopping by.
