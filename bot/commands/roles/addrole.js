'use strict';

const Command = require('lib/command.js');
const fs = require('fs');

class AddRole extends Command {

  constructor(bot) {
    super(bot,
          'addrole',
          'Add role to self assignable roles list [Administrator only]');
  }

  process(msg, role) {
    const rolesArray = require('./roles.json').roles;
    
    // This command is admin only
    if (!msg.member.hasPermission('ADMINISTRATOR')) return;

    // Check if the role is already in the list
    if (rolesArray.includes(role))
      return msg.channel.sendMessage('Role is already in the list');

    // Check for roles of the guild
    if (!msg.guild.roles.exists('name', role))
      return msg.channel.sendMessage('No such role found');

    // Add role to roles array
    rolesArray.push(role);

    // Update roles.json file
    fs.writeFile('bot/commands/roles/roles.json', JSON.stringify({roles: rolesArray}, null, 2),
      err => {
        if (err) console.error(err);

        msg.channel.sendMessage('Role successfully added');
      });
  }
}

module.exports = AddRole;
