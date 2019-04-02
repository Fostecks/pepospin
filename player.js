const discord = require("discord.js");
const YTDL = require("ytdl-core");
const indexExports = require("./index.js");

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
            .setThumbnail(_videoMetadata.videoInfo.thumbnail_url)
            .setColor(0xFF0000)
            .setFooter(_videoMetadata.videoFormat.audioBitrate + "kbps • " + 
                _videoMetadata.videoFormat.audio_sample_rate / 1000 + " kHz • codec: " + 
                _videoMetadata.videoFormat.audioEncoding);
        channel.send(richText);
    }

    /** 
     * Plays a youtube link as an audio stream into a voiceConnection. 
     * Sets bot activity as "Playing <title>"
     * @param {String} trackID full youtube link as a string
     * @param {VoiceConnection} connection discord guild VoiceConnection object
     */
    async _play(trackID, connection) {
        this._resetVideoMetadataPromise();
        let ytdl = YTDL(trackID, {filter: "audio", quality: "highestaudio"});
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
        this._activeQueue = new Promise(async (queueResolve, queueReject) => {
            // Audio play loop
            for(const link of linkArray) {
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