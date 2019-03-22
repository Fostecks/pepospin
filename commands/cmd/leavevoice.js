const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");

/** 
 * Bot command to make discord bot leave its current voice channel.
 */
class LeaveVoice extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "leave",
            group: "cmd",
            memberName: "leave",
            description: "leave voice channel",
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        if(message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
            indexExports.bot.user.setActivity(null);
            console.log("Disconnected from: " + message)
        }
        else {
            message.channel.send("Not in a channel");
        }
    }
}

module.exports = LeaveVoice;