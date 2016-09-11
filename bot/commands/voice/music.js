'use strict';

const Command = require('lib/command.js');
const ytdl = require('ytdl-core');
const BOT_COMMAND_ROLE = require('configs/config.json').BOT_COMMAND_ROLE;

class Music extends Command {

  constructor(bot) {
    super(bot,
          'music <play|pause|resume|stop|volume|skip>',
          'Music player');
    this.voiceConnDatas = new Map();  // Map of guild id mapping music info
  }

  process(msg, suffix) {
    let txtChannel = msg.channel;
    const GUILD_ID = txtChannel.guild.id;

    // Get voice connection for the guild where command is triggered
    let voiceConns = msg.client.voiceConnections;
    let voiceConn = voiceConns.get(GUILD_ID);

    // Check that bot is in voice channel
    if (!voiceConn) return txtChannel.sendMessage('I am not in any voice channel');

    // Save voice connection data separately for guilds
    if (!this.voiceConnDatas.has(GUILD_ID)) {
      this.voiceConnDatas.set(GUILD_ID, {
        queue: {
          titles: [],
          urls: []
        },
        dispatcher: undefined,
        playing: false
      });
    }

    // Get voice connectoin data for guild where command is triggered
    let voiceConnData = this.voiceConnDatas.get(GUILD_ID);

    let splitSuffix = suffix.split(' ');
    let musicCommand = splitSuffix[0];
    let musicName = splitSuffix[1];

    switch(musicCommand) {
      case 'play': return this.play(msg, voiceConn, voiceConnData, musicName);
      case 'pause': return this.pause(msg, voiceConnData);
      case 'resume': return this.resume(msg, voiceConnData);
      case 'stop': return this.stop(msg, voiceConnData);
      case 'volume': return this.volume(msg, voiceConnData, musicName);
      case 'skip': return this.skip(msg, voiceConnData);
      default: return msg.channel.sendMessage(
                  `Invalid command. Use \`${this.prefix}help music\` for commands`);
    }
  }

  execute(msg, voiceConn, voiceConnData, musicName) {
    console.log('playing');
    const stream = ytdl(musicName, {filter: 'audioonly'});
    voiceConnData.dispatcher = voiceConn.playStream(stream);
    voiceConnData.playing = true;
    msg.channel.sendMessage(`Now Playing: ${musicName}`);

    voiceConnData.dispatcher.on('end', () => {
      console.log('Ended');
      voiceConnData.playing = false;
      if (voiceConnData.queue.urls.length > 0) {
        let musicName = voiceConnData.queue.urls.shift();
        setTimeout(() => this.execute(msg, voiceConn, voiceConnData, musicName), 1000);
      } else {
        console.log('queue ended');
      }
    });

    voiceConnData.dispatcher.on('error', console.error);
  }

  play(msg, voiceConn, voiceConnData, musicName) {
    if (voiceConnData.queue.urls.length === 0 && !voiceConnData.playing) {
      this.execute(msg, voiceConn, voiceConnData, musicName);
    } else {
      voiceConnData.queue.urls.push(musicName);
      msg.channel.sendMessage(`${musicName} has been added to the queue.`);
    }
  }

  pause(msg, voiceConnData) {
    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    if (!voiceConnData.playing)
      return msg.channel.sendMessage('No music being played');

    voiceConnData.dispatcher.pause();
    voiceConnData.playing = false;
    msg.channel.sendMessage(`Music has been paused`);
  }

  resume(msg, voiceConnData) {
    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    if (voiceConnData.playing)
      return msg.channel.sendMessage('Music is already being played');

    voiceConnData.dispatcher.resume();
    voiceConnData.playing = true;
    msg.channel.sendMessage('Music has been resumed');
  }

  skip(msg, voiceConnData) {
    voiceConnData.dispatcher.end();
    msg.channel.sendMessage('Music has been skipped');
  }

  stop(msg, voiceConnData) {
    voiceConnData.playing = false;
    voiceConnData.queue.urls = [];
    voiceConnData.dispatcher.end();
    msg.channel.sendMessage('Music has been stopped');
  }

  volume(msg, voiceConnData, number) {
    if (isNaN(number))
      return msg.channel.sendMessage('Enter valid number [0-200]')

    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    let vol = number*0.01;
    voiceConnData.dispatcher.setVolume(vol);
    msg.channel.sendMessage(`Volume has been set to ${number}%`);
  }

}

module.exports = Music;
