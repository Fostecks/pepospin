const Commando = require("discord.js-commando");

class JoinVoice extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "join",
            group: "cmd",
            memberName: "join",
            description: "Join voice channel of commander",
        });
    }

    async run(message, args) {
        if(message.member.voiceChannel) {
            if(!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then((connection) => {
                    //joined channel
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