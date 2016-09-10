'use strict';

const Command = require('lib/command.js');
const now = require('performance-now');

class Ping extends Command {

  constructor(bot) {
    super(bot,
          'ping',
          'Check latency');
  }

  process(msg) {
    const txtChannel = msg.channel;

    let start = now();

    txtChannel.sendMessage('Processing...')
      .then( nextMessage =>  {
        let latency = Math.trunc(now() - start);
        nextMessage.edit(`Reply time: ${latency}ms`);
      });
  }

}

module.exports = Ping;
