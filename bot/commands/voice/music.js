'use strict';

const Command = require('lib/command.js');
const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
const BOT_COMMAND_ROLE = require('configs/config.json').BOT_COMMAND_ROLE;
const YOUTUBE_API_KEY = require('configs/auth.json').YOUTUBE_API_KEY;

class Music extends Command {

  constructor(bot) {
    super(bot,
          'music <play|pause|resume|stop|volume|skip> <YT URL for play>',
          'Music player');
    this.voiceConnDatas = new Map();  // Map of guild id mapping music info
    this.youTube = new YouTube();
    this.youTube.setKey(YOUTUBE_API_KEY);
  }

  process(msg, suffix) {
    let txtChannel = msg.channel;
    const GUILD_ID = txtChannel.guild.id;

    if (!msg.member.voiceChannel)
      return msg.channel.sendMessage('Be in voice channel first. Don\'t try to mess with the queue, you shit fuck');

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
        playing: false,
        volume: 1
      });
    }

    // Get voice connectoin data for guild where command is triggered
    let voiceConnData = this.voiceConnDatas.get(GUILD_ID);

    let splitSuffix = suffix.split(' ');
    let musicCommand = splitSuffix[0];
    let musicSuffix = splitSuffix.slice(1).join(' ');

    switch(musicCommand) {
      case 'play': return this.play(msg, voiceConn, voiceConnData, musicSuffix);
      case 'pause': return this.pause(msg, voiceConnData);
      case 'resume': return this.resume(msg, voiceConnData);
      case 'stop': return this.stop(msg, voiceConnData);
      case 'volume': return this.volume(msg, voiceConnData, musicSuffix);
      case 'skip': return this.skip(msg, voiceConnData);
      case 'queue': return this.queue(msg, voiceConnData);
      default: return msg.channel.sendMessage(
                  `Invalid command. Use \`${this.prefix}help music\` for commands`);
    }
  }

  execute(msg, nextMsg, voiceConn, voiceConnData, musicUrl) {
    console.log('playing');
    let stream;

    // Readable stream
    try {
      stream = ytdl(musicUrl, {filter: 'audioonly'});
    } catch(e) {
      return console.error(e);
    }

    // Plays the stream
    voiceConnData.dispatcher = voiceConn.playStream(stream);

    // Set volume
    voiceConnData.dispatcher.setVolume(voiceConnData.volume);

    voiceConnData.playing = true;

    if (nextMsg) {
      nextMsg.edit(`Now Playing: **${voiceConnData.nowPlaying}**`);
    } else {
      msg.channel.sendMessage(`Now Playing: **${voiceConnData.nowPlaying}**`);
    }

    // Catch stream end
    voiceConnData.dispatcher.on('end', () => {
      // nextMsg does not change when end is emitted
      // so manually set it to null to prevent it from getting old nextMsg
      nextMsg = null;

      voiceConnData.playing = false;

      if (voiceConnData.queue.urls.length > 0) {
        let musicUrl = voiceConnData.queue.urls.shift();
        let musicTitle = voiceConnData.queue.titles.shift();

        voiceConnData.nowPlaying = musicTitle;

        setTimeout(() => this.execute(msg, nextMsg, voiceConn, voiceConnData, musicUrl), 1000);
      } else {
        voiceConnData.nowPlaying = null;
        msg.channel.sendMessage('Queue ended');
      }
    });

    // Catch errors
    voiceConnData.dispatcher.on('error', console.error);
  }

  play(msg, voiceConn, voiceConnData, musicName) {
    let musicUrl = musicName;
    console.log('Playing', musicName);
    msg.channel.sendMessage('Processing...')
      .then(nextMsg => {

        const promise = new Promise((resolve) => {
          if (!musicName.startsWith('http')){
            this.youTube.search(musicName, 1, (err, result) => {
              if (err) return nextMsg.edit('Error');

              let videoId = result.items[0].id.videoId;
              if (!videoId)
                return nextMsg.edit('Music not found');

              musicUrl = 'https://www.youtube.com/watch?v=' + result.items[0].id.videoId;
              resolve(result.items[0].snippet.title);
            });
          } else {
            // Fall back to ytdl to get information if direct video link is given
            ytdl.getInfo(musicUrl, (err, info) => {
              if (err) {
                console.error(err);
                return nextMsg.edit('**Bad URL**');
              }

              resolve(info.title);
            });
          }
        });

        promise.then(musicTitle => {
          if (voiceConnData.queue.urls.length === 0 && !voiceConnData.playing) {
            voiceConnData.nowPlaying = musicTitle;

            return this.execute(msg, nextMsg, voiceConn, voiceConnData, musicUrl);
          } else {
            voiceConnData.queue.urls.push(musicUrl);
            voiceConnData.queue.titles.push(musicTitle);

            return nextMsg.edit(`**${musicTitle}** has been added to the queue.`);
          }
        });

      });
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

    // clear queue
    voiceConnData.queue.urls = [];
    voiceConnData.queue.titles = [];
    voiceConnData.nowPlaying = null;

    msg.channel.sendMessage('Music has been stopped');

    // Emits end event
    voiceConnData.dispatcher.end();
  }

  volume(msg, voiceConnData, number) {
    if (!number)
      return msg.channel.sendMessage(`Volume: ${voiceConnData.volume*100}%`);

    // Accept only numbers
    if (isNaN(number))
      return msg.channel.sendMessage('Enter valid number [0-200]');

    // Only allow user with bot command role to use this command
    if (!msg.member.roles.exists('name', BOT_COMMAND_ROLE))
      return msg.channel.sendMessage('You do not have enough permission');

    let vol = number*0.01;
    voiceConnData.dispatcher.setVolume(vol);
    voiceConnData.volume = vol;
    msg.channel.sendMessage(`Volume has been set to ${number}%`);
  }

  queue(msg, voiceConnData) {
    let titles = voiceConnData.queue.titles;

    let msgString = '';

    if (voiceConnData.nowPlaying)
      msgString += `Currently Playing: **${voiceConnData.nowPlaying}**\n\n`;

    let position = 1;

    msg.channel.sendMessage('Processing...')
      .then(nextMsg => {
        msgString += '**Queue:**\n';

        if (titles.length === 0) {
          msgString += 'Empty';
        } else {
          for (let title of titles) {
            msgString += `${position++}. **${title}**` + '\n';
          }
        }

        nextMsg.edit(msgString);
      });
  }

}

module.exports = Music;
