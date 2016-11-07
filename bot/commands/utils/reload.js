'use strict';

const Command = require('lib/command.js');
const OWNER_ID = '188614130263916545';

class Reload extends Command {

  constructor(bot) {
    super(bot,
          'reload',
          'Reload all commands [Owners only]');
    this.allowedUsers = [OWNER_ID, '188382456313806848'];
  }

  process(msg) {
    if (!this.allowedUsers.includes(msg.member.id)) return;

    msg.channel.sendMessage('Processing...')
      .then( nextMessage =>  {
        this.bot.reload();
        nextMessage.edit(`successfully reloaded`);
      });
  }

}

module.exports = Reload;
