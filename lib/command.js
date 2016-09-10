'use strict';

/**
 * Parent Command class
 */
class Command {

  /**
   * Constructor
   *
   * @param bot Bot object
   * @param usage Usage of command
   * @desc desc Desscription about command
   */
  constructor(bot, usage, desc) {
    this.bot = bot;
    this.usage = this.prefix + usage;
    this.desc = desc;
  }

  // Getters for easy life
  get client() { return this.bot.client; }
  get prefix() { return this.bot.PREFIX; }

  /**
   * generate help string for help command
   */
  generateHelp() {
    return `${this.desc}\nUsage: \`${this.usage}\``;
  }

}

module.exports = Command;
