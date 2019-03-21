const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core-discord");
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

    async run(message, args) {
        let connection = message.guild.voiceConnection;
        let radioMap = indexExports.getMap();
        let songIndex = 0;
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            let dispatcher = connection.playOpusStream(await YTDL(linkArray[songIndex++], {filter: "audioonly"}));
            dispatcher.on("end", async () => {
                if(songIndex < linkArray.length) {
                    dispatcher = connection.playOpusStream(await YTDL(linkArray[songIndex++], {filter: "audioonly"}));
                } 
                else {
                    connection.disconnect();
                }
            });
        }
    }
}



module.exports = Play;