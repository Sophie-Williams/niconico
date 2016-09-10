'use strict';

const SetGame = require('./utils/setgame.js');
const Help = require('./standard/help.js');
const Ping = require('./utils/ping.js');
const CustomEmote = require('./fun/emote.js');
const Rps = require('./fun/rps.js');
const Music = require('./voice/music.js');
const Join = require('./voice/join.js');
const Leave = require('./voice/leave.js');

// Map to map commands
let commands = new Map([
  ['setgame', SetGame],
  ['help', Help],
  ['ping', Ping],
  ['emote', CustomEmote],
  ['rps', Rps],
  ['music', Music],
  ['join', Join],
  ['leave', Leave]
]);

module.exports = commands;
