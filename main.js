"use strict";

require('app-module-path').addPath(__dirname);
const Bot = require('./bot');
const auth = require('configs/auth.json');

// Create a new Bot
let bot = new Bot(auth);

// Start the bot
bot.start();
