'use strict';

const Command = require('lib/command.js');
const fs = require('fs');

class RemoveRole extends Command {

  constructor(bot) {
    super(bot,
          'removerole',
          'Remove role from self-assignable roles list [Administrator only]');
  }

  process(msg, word) {
    const respondList = require('./respondList.json').respondList;
    const respondListKeys = Object.keys(respondList);
    const wordRegex = `\\b${word}\\b`;
    // This command is admin only
    if (!msg.member.hasPermission('ADMINISTRATOR')) return;

    // Delete propery from respondList if word exists 
    let index = respondListKeys.indexOf(wordRegex);
    if (index == -1) return msg.reply('Word is not in the list');
    delete respondList[respondListKeys[index]];

    // Update roles.json file
    fs.writeFile('bot/commands/fun/respondList.json', JSON.stringify({respondList: respondList}, null, 2),
      err => {
        if (err) console.error(err);

        msg.reply(`I will no longer respond to **${word}**`);
      });
  }
}

module.exports = RemoveRole;
