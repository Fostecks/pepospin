const Commando = require("discord.js-commando");
const discord = require("discord.js");
const YTDL = require("ytdl-core");
const indexExports = require("../../index.js");

const videoMetadata = {};
let videoMetadataPromise;
const promiseMethods = {};

/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * a given text channel name. Requires bot to be connected to a 
 * voice channel.
 */
class Play extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "play",
            group: "cmd",
            memberName: "play",
            description: "play requested radio channel",
        });
    }

    /** 
     * Plays a youtube link as an audio stream into a voiceConnection. 
     * Sets bot activity as "Playing <title>"
     * @param {String} trackID full youtube link as a string
     * @param {VoiceConnection} connection discord guild VoiceConnection object
     */
    async play(trackID, connection) {
        this.resetVideoMetadataPromise();
        let ytdl = YTDL(trackID, {quality: "highestaudio"});
        ytdl.on('info', (videoInfo, videoFormat) => {
            console.log("Audio encoding: " + videoFormat.audioEncoding);
            console.log("Audio bitrate: " + videoFormat.audioBitrate);
            console.log("Audio sample rate: " + videoFormat.audio_sample_rate);
            console.log("Attempting to play: " + videoInfo.title);

            videoMetadata.videoInfo = videoInfo;
            videoMetadata.videoFormat = videoFormat;
            promiseMethods.resolve();
    
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

    resetVideoMetadataPromise() {
        videoMetadataPromise = new Promise(resolve => promiseMethods.resolve = resolve);
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        indexExports.bot.killCommand = false;
        let connection = message.guild.voiceConnection;
        let radioMap = indexExports.getMap();
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            
            // Audio play loop
            for(const link of linkArray) {
                if(indexExports.bot.killCommand === true) break;
                indexExports.bot.audioStreamDispatcher = await this.play(link, connection);

                await videoMetadataPromise;
                let richText = new discord.RichEmbed()
                    .addField("Now Playing", videoMetadata.videoInfo.title)
                    .setThumbnail(videoMetadata.videoInfo.thumbnail_url)
                    .setColor(0xFF0000)
                    .setFooter(videoMetadata.videoFormat.audioBitrate + "kbps • " + 
                        videoMetadata.videoFormat.audio_sample_rate / 1000 + " kHz • codec: " + 
                        videoMetadata.videoFormat.audioEncoding);

                message.doNotDelete = true;
                message.channel.send(richText);

                await new Promise(resolve => indexExports.bot.audioStreamDispatcher.on('end', resolve));
            }
            connection.disconnect();
        }
    }
}

module.exports = Play;