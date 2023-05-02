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

if you're on an arm-based mac, node-canvas might give you some trouble when installing.. try `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman` to install its dependencies, then `npm i`. at least that's what the [node-canvas repo](https://github.com/Automattic/node-canvas) says in the installation instructions. though that didn't work for me without also running `PKG_CONFIG_PATH='/opt/homebrew/Cellar/pango/1.50.12/lib/pkgconfig:/opt/homebrew/Cellar/fribidi/1.0.12/lib/pkgconfig' npm i`. maybe it'll work for you without that though. idk
