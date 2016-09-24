'use strict';

const Command = require('lib/command.js');

class Join extends Command {

  constructor(bot) {
    super(bot,
          'join',
          'Get bot to join voice channel');
  }

  process(msg) {
    let vChannel = msg.member.voiceChannel;

    if (!vChannel)
      return msg.channel.sendMessage('Be in voice channel first');

    if(!vChannel.permissionsFor(msg.client.user).hasPermission('CONNECT'))
      return msg.channel.sendMessage('I do not have permission to connect');

    let voiceConns = msg.client.voiceConnections;
    let voiceConn = voiceConns.get(msg.channel.guild.id);

    if (voiceConn) return msg.reply('I am already in voice channel');

    vChannel.join()
      .then(() => console.log(`Connected to ${vChannel.name}`))
      .catch(console.error);
  }

}

module.exports = Join;
