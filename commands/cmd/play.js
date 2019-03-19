const Commando = require("discord.js-commando");
const YTDL = require("ytdl-core-discord");
const getMap = require("../../index.js");

class Play extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "play",
            group: "cmd",
            memberName: "play",
            description: "play requested radio channel",
        });
    }

    async run(message, args) {
        async function Play(connection, message) {
            console.log(getMap());
            let dispatcher = connection.playOpusStream(await YTDL("https://youtu.be/CgnmRmF0zJg?list=PLfG0HYK6dC4z62yhJZQx7UMPQhzrPUIdc", {filter: "audioonly"}));
            dispatcher.on("end", () => {
                connection.disconnect();
            })
        }
    }
}



module.exports = Play;