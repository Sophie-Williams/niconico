'use strict';

const Command = require('lib/command.js');

class Leave extends Command {

  constructor(bot) {
    super(bot,
          'leave',
          'Get bot to disconnect from voice channel');
  }

  process(msg) {
    let txtChannel = msg.channel;
    const GUILD_ID = txtChannel.guild.id;

    // Get voice connection for the guild where command is triggered
    let voiceConns = msg.client.voiceConnections;
    let voiceConn = voiceConns.get(GUILD_ID);

    voiceConn.disconnect();
  }

}

module.exports = Leave;
