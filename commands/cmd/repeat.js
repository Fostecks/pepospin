const Commando = require("discord.js-commando");
const Player = require("../../player.js");


/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * a random text channel. Requires bot to be connected to a 
 * voice channel.
 */
class Repeat extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "repeat",
            group: "cmd",
            memberName: "repeat",
            description: "replay current track after it finishes",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        console.log("Repeat invoked, repeating current track after it completes");
        let player = new Player().getInstance();
        player.repeatCurrentTrack();
    }
}

module.exports = Repeat;