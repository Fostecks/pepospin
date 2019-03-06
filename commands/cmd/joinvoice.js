const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core-discord")

async function Play(connection, message) {
    let validate = await YTDL.validateURL("https://www.youtube.com/watch?v=DeoOJbQB8rU4");
    console.log(validate);
    let dispatcher = connection.play(await YTDL("https://www.youtube.com/watch?v=DeoOJbQB8rU4", {filter: "audioonly"}));
    dispatcher.on("end", () => {
        connection.diconnect();
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
                    console.log("ree");
                })
            }
            else {
                console.log(rip);
            }
        }
        else {
            message.channel.send("Couldn't join ur shit");
        }
    }
}



module.exports = JoinVoice;