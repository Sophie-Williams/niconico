"use strict";

const Discord = require('discord.js');
const Client = Discord.Client;
const config = require('configs/config');
const commands = require('./commands');
let respondList = require('./commands/fun/respondList.json').respondList;
let respondListKeys = Object.keys(respondList);

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

    // Log for reconnection
    this.client.on('reconnecting', () => console.log('Reconnecting..'));

    this.client.on('disconnect', () => console.log('Disconencted from Discord'));

    this.client.login(this.auth.TOKEN)
      .then(() => console.log("Logged in successfully"))
      .catch(err => console.log("Error: " + err));

    this.client.on('guildMemberAdd', member => {
      let guild = member.guild;
      this.logAddOrRemoveEvent(guild, member, 'add');

      let welcomeChannel = guild.channels.find('name', 'welcome');
      if (welcomeChannel)
        guild.defaultChannel.sendMessage(`${member}, Welcome to our server. Check out ${welcomeChannel} and enjoy your stay!`);
      else
        guild.defaultChannel.sendMessage(`${member}, Welcome to our server. Enjoy your stay!`);

    });

    this.client.on('guildMemberRemove', member => {
      let guild = member.guild;
      this.logAddOrRemoveEvent(guild, member, 'remove');

      let tuxEmoji = guild.emojis.find('name', 'tux_ninja');

      if (tuxEmoji)
        guild.defaultChannel.sendMessage(`${member}, Bye! RIP! ${tuxEmoji}`);
      else
        guild.defaultChannel.sendMessage(`${member}, Bye! RIP!`);
    });
  }

  logAddOrRemoveEvent(guild, member, eventType) {
    if (!guild.available) return console.log('Guild is not available');

    let logChannel = guild.channels.find('name', 'event-log');
    let clientMember = guild.member(this.client.user);
    let defaultChannel = guild.defaultChannel;

    if (!logChannel) return;

    if (!logChannel.permissionsFor(clientMember).hasPermission('SEND_MESSAGES')) {
      if (defaultChannel.permissionsFor(clientMember).hasPermission('SEND_MESSAGES')) {
        return defaultChannel.sendMessage(`I do not have permission to send message in ${logChannel}`);
      }
      return;
    }

    if (eventType === 'add') {
      logChannel.sendMessage(`**${member.user.username}** joined the server.`);
    } else if (eventType === 'remove') {
      logChannel.sendMessage(`**${member.user.username}** left the server.`);
    } else {
      throw new TypeError('No such eventType');
    }
  }

  /**
   * Handle messages and run commands accordinly
   *
   * @param msg Message to be handled
   */
  handleMessage(msg) {
    // Ignore its own message
    if (msg.author.id === this.client.user.id) return;
    
    // Ignore DMs
    if (msg.channel instanceof Discord.DMChannel) return;
    
    // Respond to messages containing words from respond list
    for (const prop of respondListKeys) {
      const regExp = new RegExp(prop, 'g');
      console.log(regExp);
      if (msg.content.match(regExp)) {
        msg.channel.sendMessage(respondList[prop]);
      }
    }

    // Check if the message starts with prefix
    if (!msg.content.startsWith(this.PREFIX)) return;

    let splitted = msg.content.split(' ');
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

  reload() {
    this.commandsCache = [];
    this.load();
    respondList = require('./commands/fun/respondList.json').respondList;
    respondListKeys = Object.keys(respondList);
  }

}

module.exports = Bot;
