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
        let time1 = Date.now();
        message.channel.send("Reconstructing radio map...");
        let radioMap = indexExports.getMap();
        radioMap = {};
        await indexExports.constructRadioMap();
        let time2 = Date.now();
        let time = time2 - time1;
        message.channel.send("Radio map reconstructed in " + time + " ms.");
    }
}

module.exports = Purge;