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
        nowPlaying: undefined,
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
      case 'queue': return this.queue(msg, voiceConnData);
      default: return msg.channel.sendMessage(
                  `Invalid command. Use \`${this.prefix}help music\` for commands`);
    }
  }

  execute(msg, nextMsg, voiceConn, voiceConnData, musicName) {
    console.log('playing');

    // Readable stream
    const stream = ytdl(musicName, {filter: 'audioonly'});

    // Plays the stream
    voiceConnData.dispatcher = voiceConn.playStream(stream);

    voiceConnData.playing = true;

    nextMsg.edit(`Now Playing: **${voiceConnData.nowPlaying}**`);

    // Catch stream end
    voiceConnData.dispatcher.on('end', () => {
      console.log('Ended');
      voiceConnData.playing = false;
      if (voiceConnData.queue.urls.length > 0) {
        let musicName = voiceConnData.queue.urls.shift();
        setTimeout(() => this.execute(msg, nextMsg, voiceConn, voiceConnData, musicName), 1000);
      } else {
        console.log('queue ended');
      }
    });

    // Catch errors
    voiceConnData.dispatcher.on('error', console.error);
  }

  play(msg, voiceConn, voiceConnData, musicName) {
    msg.channel.sendMessage('Processing...')
      .then(nextMsg => {
        ytdl.getInfo(musicName, (err, info) => {
          if (err) return console.error(err);

          if (voiceConnData.queue.urls.length === 0 && !voiceConnData.playing) {
            voiceConnData.nowPlaying = info.title;
            this.execute(msg, nextMsg, voiceConn, voiceConnData, musicName);
          } else {
            voiceConnData.queue.urls.push(musicName);
            voiceConnData.queue.titles.push(info.title);
            nextMsg.edit(`**${info.title}** has been added to the queue.`);
          }
        });
      });
    // Get info

  }

  pause(msg, voiceConnData) {
    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    // Check if the music is being played
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

    // Check if the music is being played
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

    // clear queue urls
    voiceConnData.queue.urls = [];

    // Emits end event
    voiceConnData.dispatcher.end();

    msg.channel.sendMessage('Music has been stopped');
  }

  volume(msg, voiceConnData, number) {
    // Accept only numbers
    if (isNaN(number))
      return msg.channel.sendMessage('Enter valid number [0-200]');

    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    let vol = number*0.01;
    voiceConnData.dispatcher.setVolume(vol);
    msg.channel.sendMessage(`Volume has been set to ${number}%`);
  }

  queue(msg, voiceConnData) {
    let titles = voiceConnData.queue.titles;

    let msgString = `Currently Playing: **${voiceConnData.nowPlaying}**` + '\n\n**Queue:**\n';

    let position = 1;

    for (let title of titles) {
      msgString += `${position++}. **${title}**` + '\n';
    }

    msg.channel.sendMessage(msgString);
  }

}

module.exports = Music;
