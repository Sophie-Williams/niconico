"use strict";

const Client = require('discord.js').Client;
const config = require('configs/config');
const commands = require('./commands');

class Bot {

  /**
   * Constructor
   *
   * @param auth Authorization config
   */
  constructor(auth) {
    this.client = null;
    this.auth = auth;
    this.PREFIX = config.PREFIX;
    this.commandsCache = [];
  }

  /**
   * Start the bot
   */
  start() {
    this.client = new Client({bot: false});

    // catch errors
    this.client.on('error', e => console.log(e));

    // Notify when bot is ready
    this.client.on('ready', () => console.log('Bot is ready'));

    // Load all commands
    this.load();

    // Catch all messages
    this.client.on('message', this.handleMessage.bind(this));

    this.client.login(this.auth.TOKEN)
      .then(() => console.log("Logged in successfully"))
      .catch(err => console.log("Error: " + err));
  }

  /**
   * Handle messages and run commands accordinly
   *
   * @param msg Message to be handled
   */
  handleMessage(msg) {
    // Check if the message starts with prefix
    if (!msg.content.startsWith(this.PREFIX)) return;

    let cleaned = msg.content.replace(/[ \n]/, ' ');

    let splitted = cleaned.split(' ');
    let cmd = splitted[0].slice(1);
    let suffix = splitted.slice(1).join(' ');

    // Check if the command exists
    let command = this.commandsCache.find(command => command.name === cmd);
    if (command == undefined) return;

    command.command.process(msg, suffix);
  }

  /**
   * Cache all commands
   */
  load() {
    for (let [name, Command] of commands) {
      this.commandsCache.push({
        name: name,
        command: new Command(this)
      });
    }
  }

}

module.exports = Bot;
