const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Printout extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "printout",
            group: "debug",
            memberName: "printout",
            description: "printout",
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
        let radioString = ""; 

        let keys = Object.keys(radioMap).sort();
        
        for(let key of keys) {
            radioString += key + ": " + radioMap[key].length + "\n";
        }

        message.channel.send(radioString);
    }
}

module.exports = Printout;