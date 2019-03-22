const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core");
const indexExports = require("../../index.js");


class Play extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "play",
            group: "cmd",
            memberName: "play",
            description: "play requested radio channel",
        });
    }

    async play(trackID, connection) {
        let ytdl = YTDL(trackID, {quality: "highestaudio"});
        ytdl.on('info', (videoInfo, videoFormat) => {
            //videoFormat: audioEncoding
            //videoFormat: audioBitrate
            //videoFormat: audio_sample_rate
            //videoInfo: title
            console.log("Stream found!");
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
    

    async run(message, args) {
        let connection = message.guild.voiceConnection;
        let radioMap = indexExports.getMap();
        let trackIndex = 0;
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            let currentTrack = linkArray[trackIndex];
            let dispatcher = await this.play(currentTrack, connection);
            dispatcher.on("end", async () => {
                if(trackIndex < linkArray.length) {
                    currentTrack = linkArray[++trackIndex];
                    dispatcher = await this.play(currentTrack, connection);
                }
                else {
                    connection.disconnect();
                }
            });
        }
    }
}



module.exports = Play;