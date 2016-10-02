'use strict';

const Command = require('lib/command.js');

class SysStats extends Command {

  constructor(bot) {
    super(bot,
          'sysstats',
          'Shows system status');
  }

  process(msg) {
    const memory = process.memoryUsage();
    let msgString = '__**SYSTEM STATS**__\n' +
                    `**Total Heap:** ${(memory.heapTotal/1048576).toFixed(2)}MB\n` +
                    `**Used Heap:** ${(memory.heapUsed/1048576).toFixed(2)}MB\n` +
                    `**OS:** ${process.platform}\n`+
                    `**CPU Architecture:** ${process.arch}`;
    msg.channel.sendMessage(msgString);
  }

}

module.exports = SysStats;
