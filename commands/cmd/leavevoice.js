const Commando = require("discord.js-commando");

class LeaveVoice extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "leave",
            group: "cmd",
            memberName: "leave",
            description: "leave voice channel",
        });
    }

    async run(message, args) {
        if(message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
        }
        else {
            message.channel.send("Not in a channel");
        }
    }
}

module.exports = LeaveVoice;