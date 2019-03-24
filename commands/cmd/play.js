const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core");
const indexExports = require("../../index.js");

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
        let ytdl = YTDL(trackID, {quality: "highestaudio"});
        ytdl.on('info', (videoInfo, videoFormat) => {
            console.log("Audio encoding: " + videoFormat.audioEncoding);
            console.log("Audio bitrate: " + videoFormat.audioBitrate);
            console.log("Audio sample rate: " + videoFormat.audio_sample_rate);
            console.log("Attempting to play: " + videoInfo.title);
            indexExports.bot.user.setActivity(videoInfo.title, { type: 'STREAMING' });
        });
        try {
            let dispatcher = connection.playStream(ytdl);
            return dispatcher;
        } catch(err) {
            console.log(err);
        }
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
        let trackIndex = 0;
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            let currentTrack = linkArray[trackIndex];
            indexExports.bot.audioStreamDispatcher = await this.play(currentTrack, connection);
            indexExports.bot.audioStreamDispatcher.on("end", async () => {
                if(!indexExports.bot.killCommand && trackIndex < linkArray.length) {
                    currentTrack = linkArray[++trackIndex];
                    indexExports.bot.audioStreamDispatcher = await this.play(currentTrack, connection);
                }
                else {
                    connection.disconnect();
                }
            });
        }
    }
}

module.exports = Play;