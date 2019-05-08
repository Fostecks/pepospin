const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const utils = require("../../utils.js");


/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * a random text channel. Requires bot to be connected to a 
 * voice channel.
 */
class Random extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "random",
            group: "cmd",
            memberName: "random",
            description: "play random radio channel",
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
        var keys = Object.keys(radioMap)
        let randomRadio = keys[ keys.length * Math.random() << 0];
        let connection = message.guild.voiceConnection;
        if(radioMap && randomRadio && connection) {
            let linkArray = radioMap[randomRadio];
            let shuffledLinkArray = utils.shuffleArray(linkArray);
            utils.play(shuffledLinkArray, connection, message.channel);
        }
    }
}

module.exports = Random;