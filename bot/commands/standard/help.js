'use strict';

const commands = require('bot/commands/index.js');
const Command = require('lib/command.js');

class Help extends Command {

  /**
   * Constructor
   *
   * @param bot Bot object
   */
  constructor(bot) {
    super(bot,
          'help',
          'Help Command');
  }

  /**
   * Process the message. Contains the logic for processing command
   *
   * @param msg Message object
   * @param suffix String after command keyword (like /[command]])
   */
  process(msg, suffix) {
    let msgString = '';

    if (!suffix) {
      // List all commands without suffix
      console.log(commands);
      msgString += 'The list of commands you can use\n';

      for (let cmd of this.bot.commandsCache) {
        msgString += `**${cmd.name}**, `;
      }
    } else {
      // Specific command help with suffix
      let command = this.bot.commandsCache.find(command => command.name === suffix);
      msgString = (command === undefined) ? 'Command not found' : command.command.generateHelp();
    }

    return msg.channel.sendMessage(msgString);
  }
}

module.exports = Help;
