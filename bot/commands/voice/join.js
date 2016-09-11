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

    vChannel.join()
    .then(() => console.log('Connected!'))
    .catch(console.error);
  }

}

module.exports = Join;
