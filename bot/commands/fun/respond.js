'use strict';

const Command = require('lib/command.js');
const fs = require('fs');
const RESPOND_LIST_PATH = 'bot/commands/fun/respondList.json';

class Respond extends Command {
  
  constructor(bot) {
    super(bot,
      `respond "[word/phrase]" "[message]"`,
      `Add a word/phrase bot will respond to with a given message`);
      
    this.respondList = require('./respondList.json').respondList;
  }
  
  process(msg, suffix) {
    const INVALID_REPLY = `Invalid command usage. Use \`${this.bot.PREFIX}help respond\` to see usage`;
    const regex = /"([^"]*)"/g;   // regex to separate double quoted words
    
    // Get the first match i.e word
    let match = regex.exec(suffix);
    if (!match) return msg.reply(INVALID_REPLY); 
    const word = match[1];  // word that triggers the bot response
    
    // Get the second match i.e message
    match = regex.exec(suffix);
    if (!match) return msg.reply(INVALID_REPLY);
    const message = match[1];  // message bot responds with
    
    const regexString = `\\b${word}\\b`;  // regex to trigger bot response
    
    // Handle already added words
    if (this.respondList.hasOwnProperty(regexString))
      return msg.reply('This regex is already added.');
    
    this.respondList[regexString] = message;
    
    fs.writeFile(RESPOND_LIST_PATH, JSON.stringify({respondList: this.respondList}, null, 2),
      err => {
        if (err) console.error(err);

        msg.reply(`Bot will now respond to **${word}**`);
      });
    
  }  
  
}

module.exports = Respond;