const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const Player = require("../../player.js");
const console = require("../../logger");


/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * a given text channel name. Requires bot to be connected to a 
 * voice channel.
 */
class Skip extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "skip",
            group: "cmd",
            memberName: "skip",
            description: "skip current track",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        console.log("Skip invoked, shifting queue...")
        let player = new Player().getInstance();
        player.forceShiftQueue();
    }
}

module.exports = Skip;