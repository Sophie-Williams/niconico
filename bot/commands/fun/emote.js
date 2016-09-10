'use strict';

const Command = require('lib/command.js');
const Util = require('lib/util.js');

/**
 * Emote command to send custom emotes
 */
class CustomEmote extends Command{

  /**
   * Constructor
   *
   * @param bot Bot object
   */
  constructor(bot) {
    super(bot,
        `emote [emotename]`,
        'Send custom emote');
    this.emotes = new Map([
      ['lenny', '( ͡° ͜ʖ ͡°)'],
      ['fight', `(ง'̀-'́)ง`],
      ['swag', `(▀̿Ĺ̯▀̿ ̿)`],
      ['gangam', `O̲ppa̲ (っ-̶●̃益●̶̃)っ ,︵‿ S̲t̲yl̲e̲`],
      ['cry', `(╥﹏╥)`],
      ['doublemid', `凸(¬‿¬)凸`],
      ['fork', 'ψ(｀∇´)ψ']
    ]);
  }

  /**
   * Process the message. Contains the logic for processing command
   *
   * @param msg Message object
   * @param suffix String after command keyword (like /[command]])
   */
  process(msg, suffix) {
    if (!this.emotes.has(suffix))
      return msg.channel.sendMessage(Util.codeWrap('No such Emote found'));

    return msg.channel.sendMessage(this.emotes.get(suffix));
  }

}

module.exports = CustomEmote;
