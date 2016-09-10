'use strict';

const Command = require('lib/command.js');

class Rps extends Command{

  constructor(bot) {
    super(bot,
      'rps <rock|paper|scissor>',
      'Play rock paper scissor game');
    this.botChoices = ['rock', 'paper', 'scissor'];
  }

  process(msg, suffix) {
    if (!suffix) return;

    let userChoice = suffix;

    // Validate user choice
    if (!this.botChoices.includes(userChoice)) return;

    let userWinner = false;
    let rnd = Math.floor(Math.random()*this.botChoices.length);
    let botChoice = this.botChoices[rnd];

    let msgString = `I chose **${botChoice}**\n` ;

    if (botChoice === userChoice) {
      msgString += 'It is a tie';
    } else {
      if (userChoice === 'rock' && botChoice === 'scissor')
        userWinner = true;

      else if (userChoice === 'paper' && botChoice === 'rock')
        userWinner = true;

      else if (userChoice === 'scissor' && botChoice === 'paper')
        userWinner = true;

      msgString += (userWinner) ? 'Hey! You cheated.' : 'Screw you loser!';
    }
    msg.channel.sendMessage(msgString);
  }

}

module.exports = Rps;
