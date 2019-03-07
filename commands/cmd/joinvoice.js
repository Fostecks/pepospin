const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core-discord")

async function Play(connection, message) {
    let dispatcher = connection.playOpusStream(await YTDL("https://youtu.be/CgnmRmF0zJg?list=PLfG0HYK6dC4z62yhJZQx7UMPQhzrPUIdc", {filter: "audioonly"}));
    dispatcher.on("end", () => {
        connection.disconnect();
    })
}


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
                    message.channel.send("joined ur shit");
                    Play(connection, message);
                    
                }).catch(error => {
                    console.log(error);
                })
            }
            else {
                console.log("rip");
            }
        }
        else {
            message.channel.send("Couldn't join ur shit");
        }
    }
}



module.exports = JoinVoice;