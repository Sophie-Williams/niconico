'use strict';

const Command = require('lib/command.js');

/**
 * Command to set current playing game
 */
class SetGame extends Command {

  /**
   * Constructor
   *
   * @param bot Bot object
   */
  constructor(bot) {
    super(bot,
          'setgame <game>',
          'Set current playing game');
  }

  /**
   * Process the message. Contains the logic for processing command
   *
   * @param msg Message object
   * @param suffix String after command keyword (like /[command]])
   */
  process(msg, suffix) {
    let txtChannel = msg.channel;

    if (!suffix) return;
    msg.client.user.setStatus('online', suffix)
      .then( () => txtChannel.sendMessage(`Game status successfully set to **${suffix}**`));
  }

}

module.exports = SetGame;
