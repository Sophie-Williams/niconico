'use strict';

const Command = require('lib/command.js');

class ListAllRoles extends Command {

  constructor(bot) {
    super(bot,
          'listallroles',
          'List all self assignable roless');
  }

  process(msg) {
    // Get roles from file
    const roles = require('./roles.json').roles;

    let msgString = 'These are the self-assignable roles you can use:\n';
    
    for (let role of roles) {
      msgString += `**${role}**, `;
    }
    msg.channel.sendMessage(msgString);
  }
}

module.exports = ListAllRoles;
