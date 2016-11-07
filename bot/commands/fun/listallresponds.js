'use strict';

const Command = require('lib/command.js');

class ListAllResponds extends Command {

  constructor(bot) {
    super(bot,
          'listallresponds',
          'List all the words/phrases bots will respond to');
  }

  process(msg) {
    const respondList = require('./respondList.json').respondList;
    const respondListKeys = Object.keys(respondList);

    let msgString = 'Here is the list of all the words/phrases I will respond to:\n';
    
    for (let respondKey of respondListKeys) {
      // Dummy evaluation of respondKey to remove \b automatically
      let respondWord = respondKey.slice(2, -2);
      console.log('goo', respondWord);
      msgString += `**${respondWord}**, `;
    }
    msg.channel.sendMessage(msgString);
  }
}

module.exports = ListAllResponds;
