const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Print extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "print",
            group: "cmd",
            memberName: "print",
            description: "print",
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
        let radioString = "["; 
        let linkArray = radioMap[args];

        for(let link of linkArray) {
            radioString += link + ", \n";
        }
        radioString += "\b]"

        message.channel.send(radioString);
    }
}

module.exports = Print;