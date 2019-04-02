const Commando = require("discord.js-commando");

/** 
 * Bot command to make discord bot join the invoker's current voice channel.
 */
class JoinVoice extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "join",
            group: "cmd",
            memberName: "join",
            description: "Join voice channel of commander",
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        if(message.member.voiceChannel) {
            if(!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then((connection) => {
                    //joined channel
                    message.channel.send("Joined voice channel: " + message.member.voiceChannel.name);
                    console.log("Joined voice: " + message.member.voiceChannel.name);
                }).catch(error => {
                    console.log(error);
                })
            }
            else {
                console.log("Voice connection already present");
            }
        }
        else {
            console.log("Commander not in voice channel");
        }
    }
}

module.exports = JoinVoice;