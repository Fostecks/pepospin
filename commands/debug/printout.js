const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Printout extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "printout",
            group: "cmd",
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
        
        for(let key of Object.keys(radioMap)) {
            radioString += key + ": " + radioMap[key].length + "\n";
        }

        message.channel.send(radioString);
    }
}

module.exports = Printout;