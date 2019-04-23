const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Purge extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "purge",
            group: "debug",
            memberName: "purge",
            description: "purge",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        message.channel.send("Reconstructing radio map...");
        let radioMap = indexExports.getMap();
        radioMap = {};
        await indexExports.constructRadioMap();
        message.channel.send("Done");
    }
}

module.exports = Purge;