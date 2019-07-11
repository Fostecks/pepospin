const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const fs = require('fs');


/**
 * Exports radio collection
 */
class Export extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "export",
            group: "cmd",
            memberName: "export",
            description: "exports radio collection",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let radioMap = indexExports.getMap();
        fs.writeFileSync('radio.json', JSON.stringify(radioMap));
        message.channel.send({ files : ['radio.json']});
    }
}

module.exports = Export;