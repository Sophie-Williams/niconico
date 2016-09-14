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

    // Get voice Connection data to clear queue
    let musicCommand = this.bot.commandsCache.find(cmd => cmd.name == 'music').command;
    let voiceConnData = musicCommand.voiceConnDatas.get(GUILD_ID);
    voiceConnData.queue.titles = [];
    voiceConnData.queue.urls = [];
    voiceConnData.nowPlaying = null;
    voiceConnData.nowPlaying = false;

    voiceConn.disconnect();
    console.log('disconnected from channel');
  }

}

module.exports = Leave;
