'use strict';

const SetGame = require('./utils/setgame.js');
const Help = require('./standard/help.js');
const Ping = require('./utils/ping.js');
const Uptime = require('./utils/uptime.js');
const CustomEmote = require('./fun/emote.js');
const Rps = require('./fun/rps.js');
const Respond = require('./fun/respond.js');
const ListAllResponds = require('./fun/listallresponds.js');
const RemoveRespond = require('./fun/removerespond.js');
const Music = require('./voice/music.js');
const Join = require('./voice/join.js');
const Leave = require('./voice/leave.js');
const Eval = require('./utils/eval.js');
const IAm = require('./roles/iam.js');
const ListAllRoles = require('./roles/listallroles.js');
const AddRole = require('./roles/addrole.js');
const IAmNot = require('./roles/iamnot.js');
const RemoveRole = require('./roles/removerole.js');
const Reload = require('./utils/reload.js');
const SysStats = require('./utils/sysstats.js');

// Map to map commands
let commands = new Map([
  ['setgame', SetGame],
  ['help', Help],
  ['ping', Ping],
  ['uptime', Uptime],
  ['emote', CustomEmote],
  ['rps', Rps],
  ['music', Music],
  ['join', Join],
  ['leave', Leave],
  ['eval', Eval],
  ['iam', IAm],
  ['listallroles', ListAllRoles],
  ['addrole', AddRole],
  ['iamnot', IAmNot],
  ['removerole', RemoveRole],
  ['reload', Reload],
  ['sysstats', SysStats],
  ['respond', Respond],
  ['listallresponds', ListAllResponds],
  ['removerespond', RemoveRespond]
]);

module.exports = commands;
