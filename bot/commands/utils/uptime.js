'use strict';

const Command = require('lib/command.js');

class Uptime extends Command {

  constructor(bot) {
    super(bot,
          'uptime',
          'Show the duration for which the bot has been online since its last boot');
  }

  process(msg) {
    let uptime = Math.trunc(msg.client.uptime / 1000);

    let sec = uptime % 60;
    uptime = Math.trunc(uptime / 60);
    let min = uptime % 60;
    uptime = Math.trunc(uptime / 60);
    let hour = uptime % 60;
    uptime = Math.trunc(uptime / 24);
    let day = uptime % 24;

    let msgString = '**Uptime: ';
    if (day) msgString += day + ' days, ';
    if (hour) msgString += hour + ' hours, ';
    if (min) msgString += min + ' minutes, ';
    if (sec) msgString += sec + ' seconds';
    msgString += '**';

    msg.channel.sendMessage(msgString);
  }
}

module.exports = Uptime;
