const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
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
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let radioMap = indexExports.getMap();
        let connection = message.guild.voiceConnection;
        if(radioMap && connection && args) {
            let linkArray = radioMap[args];
            let shuffledLinkArray = utils.shuffleArray(linkArray);
            utils.play(shuffledLinkArray, connection, message.channel);
        }
    }
}

module.exports = Play;