'use strict';

const Command = require('lib/command.js');
const ytdl = require('ytdl-core');

class Music extends Command {

  constructor(bot) {
    super(bot,
          'music <play|pause|resume|stop>',
          'Music player');
    this.voiceConnDatas = new Map();  // Map of guild id mapping music info
  }

  process(msg, suffix) {
    let txtChannel = msg.channel;
    const GUILD_ID = txtChannel.guild.id;

    // Get voice connection for the guild where command is triggered
    let voiceConns = msg.client.voiceConnections;
    let voiceConn = voiceConns.get(GUILD_ID);

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

    // Check that bot is in voice channel
    if (!voiceConn) return txtChannel.sendMessage('I am not in any voice channel');

    switch(musicCommand) {
      case 'play': return this.play(txtChannel, voiceConn, voiceConnData, musicName);
      case 'pause': return this.pause(txtChannel, voiceConnData);
      case 'resume': return this.resume(txtChannel, voiceConnData);
      case 'stop': return this.stop(txtChannel, voiceConnData);
      case 'volume': return this.volume(txtChannel, voiceConnData, musicName);
      case 'skip': return this.skip(txtChannel, voiceConnData);
    }
  }

  execute(txtChannel, voiceConn, voiceConnData, musicName) {
    console.log('playing');
    const stream = ytdl(musicName, {filter: 'audioonly', quality: 'lowest'});
    voiceConnData.dispatcher = voiceConn.playStream(stream);
    voiceConnData.playing = true;
    txtChannel.sendMessage(`Now Playing: ${musicName}`);

    voiceConnData.dispatcher.on('end', () => {
      console.log('Ended');
      voiceConnData.playing = false;
      if (voiceConnData.queue.urls.length > 0) {
        let musicName = voiceConnData.queue.urls.shift();
        setTimeout(() => this.execute(txtChannel, voiceConn, voiceConnData, musicName), 1000);
      } else {
        console.log('queue ended');
      }
    });

    voiceConnData.dispatcher.on('error', console.error);
  }

  play(txtChannel, voiceConn, voiceConnData, musicName) {

    if (voiceConnData.queue.urls.length === 0 && !voiceConnData.playing) {
      this.execute(txtChannel, voiceConn, voiceConnData, musicName);
    } else {
      voiceConnData.queue.urls.push(musicName);
      txtChannel.sendMessage(`${musicName} has been added to the queue.`);
    }
  }

  pause(txtChannel, voiceConnData) {
    if (!voiceConnData.playing)
      return txtChannel.sendMessage('No music being played');

    voiceConnData.dispatcher.pause();
    voiceConnData.playing = false;
    txtChannel.sendMessage(`Music has been paused`);
  }

  resume(txtChannel, voiceConnData) {
    if (voiceConnData.playing)
      return txtChannel.sendMessage('Music is already being played');

    voiceConnData.dispatcher.resume();
    voiceConnData.playing = true;
    txtChannel.sendMessage('Music has been resumed');
  }

  skip(txtChannel, voiceConnData) {
    voiceConnData.dispatcher.end();
    txtChannel.sendMessage('Music has been skipped');
  }

  stop(txtChannel, voiceConnData) {
    voiceConnData.playing = false;
    voiceConnData.queue.urls = [];
    voiceConnData.dispatcher.end();
    txtChannel.sendMessage('Music has been stopped');
  }

  volume(txtChannel, voiceConnData, number) {
    let vol = number*0.01;
    voiceConnData.dispatcher.setVolume(vol);
    txtChannel.sendMessage(`Volume has been set to ${number}%`);
  }

}

module.exports = Music;
