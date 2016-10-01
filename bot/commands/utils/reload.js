'use strict';

const Command = require('lib/command.js');
const OWNER_ID = '188614130263916545';

class Reload extends Command {

  constructor(bot) {
    super(bot,
          'reload',
          'Reload all commands [Owner only]');
  }

  process(msg) {
    if (msg.member.id != OWNER_ID) return;

    msg.channel.sendMessage('Processing...')
      .then( nextMessage =>  {
        this.bot.reload();
        nextMessage.edit(`successfully reloaded`);
      });
  }

}

module.exports = Reload;
