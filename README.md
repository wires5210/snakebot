# snakebot

a mastodon bot that plays snake, using polls

check it out at https://botsin.space/@snake_game

- snakebot-core contains the code for the snake game
- snakebot-masto is the actual mastodon bot
- snakebot-web is a web ui for testing the bot, without needing to run a mastodon instance. i made it because i didn't want to run a mastodon instance. i probably put too much effort into it but who cares

# running
- `npm i --workspaces` to install dependencies
- `npm run start-bot` to build and run the mastodon bot
- `npm run start-web` to build start the web ui

snakebot-masto requires some environment variables to be either defined, or provided in a .env file in its folder

# help how does it actually work your code is incomprehensible
1. searches for the last post by the bot user that begins with the game's, as well as the bot's replies to it
    - the header matches the pattern `/^➡ (.+) - GAME (\d+) (END )?⬅️/`
2. decodes the game's state from the invisible text in the post's text
    - the text is made out of the characters U+2061, U+2062, U+2063, U+2064
    - check `hiddenEncode.ts` for how exactly it works
3. checks the result of the poll to decide where to move next
    - if the poll is tied, the topmost option is picked
    - the snake's current direction is always at the top, so if no one votes, the snake keeps moving forward
4. update's the game's state and posts the next image and poll
    - they have to be in separate posts because mastodon doesn't allow having both an image and a poll in one ..