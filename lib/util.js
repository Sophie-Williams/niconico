'use strict';

/**
 * Common utilities
 */
class Util {

  /**
   * Code wraps the string
   *
   * @param msgString Message string to be codewrapped
   * @param lang Language used to codewrap. Optional.
   */
  static codeWrap(msgString, lang='') {
    // Return the code-wrapped string
    return `\`\`\`${lang}\n${msgString}\`\`\``;
  }

  static sleep(milisec) {
    return new Promise(resolve => setTimeout(resolve, milisec));
  }

}

module.exports = Util;
