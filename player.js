const discord = require("discord.js");
const YTDL = require("ytdl-core");
const indexExports = require("./index.js");
const console = require("./logger");

const _videoMetadata = {};
let _videoMetadataPromise;
const _promiseMethods = {};

class Player {

    constructor() { 
    }

    _resetVideoMetadataPromise() {
        _videoMetadataPromise = new Promise(resolve => _promiseMethods.resolve = resolve);
    }

    async _postNowPlaying(channel) {
        await _videoMetadataPromise;
        let richText = new discord.RichEmbed()
            .addField("Now Playing", _videoMetadata.videoInfo.title)
            .setThumbnail(_videoMetadata.videoInfo.player_response.videoDetails.thumbnail.thumbnails[0].url)
            .setColor(0xFF0000)
            .setFooter(_videoMetadata.videoFormat.audioBitrate + "kbps • " + 
                _videoMetadata.videoFormat.audio_sample_rate / 1000 + " kHz • codec: " + 
                _videoMetadata.videoFormat.audioEncoding);
        channel.send(richText);
    }

    /** 
     * Plays a youtube link as an audio stream into a voiceConnection. 
     * Sets bot activity as "Playing <title>"
     * @param {String} trackUrl full youtube link as a string
     * @param {VoiceConnection} connection discord guild VoiceConnection object
     */
    async _play(trackUrl, connection) {
        this._resetVideoMetadataPromise();

        let options = {filter: "audio", quality: "highestaudio"};

        // capture timestamp, if any
        if(trackUrl.indexOf("&t=") > -1) {
            let timeString = trackUrl.match(/(?<=&t=)[0-9]+/)[0];
            options.begin = parseInt(timeString)*1000;
        }

        let ytdl = YTDL(trackUrl, options);

        ytdl.on('info', (videoInfo, videoFormat) => {
            console.log("Audio encoding: " + videoFormat.audioEncoding);
            console.log("Audio bitrate: " + videoFormat.audioBitrate);
            console.log("Audio sample rate: " + videoFormat.audio_sample_rate);
            console.log("Attempting to play: " + videoInfo.title);

            _videoMetadata.videoInfo = videoInfo;
            _videoMetadata.videoFormat = videoFormat;
            _promiseMethods.resolve(_videoMetadata);
    
            indexExports.bot.user.setActivity(videoInfo.title, { type: 'PLAYING' });
        });
        try {
            if(indexExports.bot.audioStreamDispatcher) {
                indexExports.bot.audioStreamDispatcher.destroy();
            }
            let dispatcher = connection.playStream(ytdl);
            return dispatcher;
        } catch(err) {
            console.log(err);
        }
    }


    /**
     * Plays a queue of youtube links as an audio stream into a voiceConnection.
     * @param {String[]} linkArray array of links to play in a queue 
     * @param {VoiceConnection} connection target guild VoiceConnection to stream
     * @param {TextChannel} channel target channel to post messages with video metadata
     */
    async playArray(linkArray, connection, channel) {
        this._activeLinkArray = linkArray;
        this._activeQueue = new Promise(async (queueResolve, queueReject) => {
            // Audio play loop
            for(this.activeIndex = 0; this.activeIndex < linkArray.length; this.activeIndex++) {
                let link = linkArray[this.activeIndex];

                //check if something tried to force quit queue
                if(indexExports.bot.killCommand === true) {
                    break;
                }
                indexExports.bot.audioStreamDispatcher = await this._play(link, connection);
                this._postNowPlaying(channel);
                await new Promise(resolve => indexExports.bot.audioStreamDispatcher.on('end', resolve));
            }
            queueResolve();
        });
        return this._activeQueue;
    }

    async forceShiftQueue() {
        if(indexExports.bot.audioStreamDispatcher &&
            !indexExports.bot.audioStreamDispatcher.destroyed) {
                indexExports.bot.audioStreamDispatcher.destroy();
        }
    }

    async killActiveQueue() {
        this.forceShiftQueue();
        indexExports.bot.killCommand = true;
        await this._activeQueue;
        indexExports.bot.killCommand = false;
    }

    getActiveLinkArray() {
        return this._activeLinkArray;
    }

    repeatCurrentTrack() {
        let currentTrack = this._activeLinkArray[this.activeIndex];
        this._activeLinkArray.splice(this.activeIndex, 0, currentTrack);
    }
}

class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Player();
        }
    }

    getInstance() {
        return Singleton.instance;
    }
}

module.exports = Singleton;