'use strict';

const Command = require('lib/command.js');

class IAmNot extends Command {

  constructor(bot) {
    super(bot,
          'iamnot <Role Name>',
          'Removes self-assignable role from yourself');
  }

  process(msg, role) {
    const roles = require('./roles.json').roles;

    // Check if the bot has manage roles permission
    if (!msg.guild.member(msg.client.user).permissions.hasPermission('MANAGE_ROLES_OR_PERMISSIONS'))
      return msg.channel.sendMessage('I do not have permission to manage roles');

    // Check if the role is an assignable role
    if (!roles.includes(role))
      return msg.reply('You can only remove self-assignable roles' +
                                    `\`${this.prefix}listallroles\` to see available roles`);

    // Check if the user already has the role
    if (!msg.member.roles.exists('name', role))
      return msg.reply('You do not have this role to remove');

    // Role object from name
    let roleObj = msg.guild.roles.find('name', role);

    // This may not be necessary
    // but still double cheking if the role string is valid
    if (!roleObj) return;

    msg.member.removeRole(roleObj)
      .then(() => msg.reply(`Bummer! You no longer have ${role} role now`))
      .catch(console.error);
  }
}

module.exports = IAmNot;
