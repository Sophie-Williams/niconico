'use strict';

const Command = require('lib/command.js');
const fs = require('fs');

class RemoveRole extends Command {

  constructor(bot) {
    super(bot,
          'removerole',
          'Remove role from self-assignable roles list');
  }

  process(msg, role) {
    const rolesArray = require('./roles.json').roles;
    
    // This command is admin only
    if (!msg.member.hasPermission('ADMINISTRATOR')) return;

    // Remove role from roles array
    let index = rolesArray.indexOf(role);
    if (index == -1) return msg.channel.sendMessage('Role is not in the list');
    rolesArray.splice(index, 1);

    // Update roles.json file
    fs.writeFile('bot/commands/roles/roles.json', JSON.stringify({roles: rolesArray}, null, 2),
      err => {
        if (err) console.error(err);

        msg.channel.sendMessage('Role successfully removed');
      });
  }
}

module.exports = RemoveRole;
