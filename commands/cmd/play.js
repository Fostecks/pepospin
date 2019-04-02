const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const Player = require("../../player.js");
const utils = require("../../utils.js");


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
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let player = new Player().getInstance();
        await player.killActiveQueue();
        let connection = message.guild.voiceConnection;
        let radioMap = indexExports.getMap();
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            let shuffledLinkArray = utils.shuffleArray(linkArray);
            await player.playArray(shuffledLinkArray, connection, message.channel).then(() => {
                if(indexExports.bot.killCommand === false) {
                    connection.disconnect();
                }
            });
            
        }
    }
}

module.exports = Play;