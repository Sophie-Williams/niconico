'use strict';

const Command = require('lib/command.js');
const fs = require('fs');

class IAm extends Command {

  constructor(bot) {
    super(bot,
          'iam <Role Name>',
          'Lets you self-assign roles to yourself');

    // Create roles file if the file does not exist
    fs.access('bot/commands/roles/roles.json', err => {
      if (err) {
        fs.writeFileSync('bot/commands/roles/roles.json', JSON.stringify({roles: []}, null, 2));
        console.log('roles.json not found.. so new file created');
      }
    });
  }

  process(msg, role) {
    const roles = require('./roles.json').roles;

    // Check if the bot has manage roles permission
    if (!msg.guild.member(msg.client.user).permissions.hasPermission('MANAGE_ROLES_OR_PERMISSIONS'))
      return msg.channel.sendMessage('I do not have permission to manage roles');

    // Check if the role is an assignable role
    if (!roles.includes(role))
      return msg.reply('No such self assignable roles in the server.' +
                                    `\`${this.prefix}listallroles\` to see available roles`);

    // Check if the user already has the role
    if (msg.member.roles.exists('name', role))
      return msg.reply('You already have this role');

    // Role object from name
    let roleObj = msg.guild.roles.find('name', role);

    // This may not be necessary
    // but still double cheking if the role string is valid
    if (!roleObj) return;

    msg.member.addRole(roleObj)
      .then(() => msg.reply(`You have ${role} role now`))
      .catch(console.error);
  }
}

module.exports = IAm;
