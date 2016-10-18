'use strict';

const Command = require('lib/command.js');
const Util = require('lib/util.js');
const OWNER_ID = '188614130263916545';

class Eval extends Command {

  constructor(bot) {
    super(bot,
          'eval <inline code or codeblock>',
          'Evaluates javascript expressions or statements (Owner only)');
    this.allowedUsers = [OWNER_ID, '188382456313806848'];
  }

  process(msg, exp) {
    if (!this.allowedUsers.includes(msg.member.id)) return;

    // Check for code blocks
    if (exp.startsWith('```js\n')) {
      exp = exp.slice(6,-4);
    }

    let msgString = '**INPUT**\n' + Util.codeWrap(exp, 'xl') + '\n**OUTPUT**\n';

    // Evaluates the expression allowing for errors
    try {
      let result = eval(exp);
      msgString += Util.codeWrap(result, 'xl') + '**INSPECTS**\n' + Util.codeWrap(JSON.stringify(result, null, 2), 'xl');
    } catch (e) {
      msgString += e;
    }
    console.log(msgString);

    return msg.channel.sendMessage(msgString);
  }

}

module.exports = Eval;
