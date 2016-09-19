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
    let hour = uptime % 24;
    let day = Math.trunc(uptime / 24);

    let msgString = '**Uptime: ';
    if (day) msgString += day + ((day===1) ? ' day, ': ' days, ');
    if (hour) msgString += hour + ((hour===1) ? ' hour, ':  ' hours, ');
    if (min) msgString += min + ((min===1) ? ' minute, ':  ' minutes, ');
    if (sec) msgString += sec + ((sec===1) ? ' second':  ' seconds');
    msgString += '**';

    msg.channel.sendMessage(msgString);
  }
}

module.exports = Uptime;
