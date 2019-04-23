const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Total extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "total",
            group: "debug",
            memberName: "total",
            description: "total",
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
        let keys = Object.keys(radioMap);
        let trackSum = 0;
        
        for(let key of keys) {
            trackSum += radioMap[key].length;
        }

        message.channel.send(trackSum + " tracks in " + keys.length + " channels.");
    }
}

module.exports = Total;