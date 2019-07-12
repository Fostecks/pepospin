const Commando = require("discord.js-commando");


class Version extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "version",
            group: "debug",
            memberName: "version",
            description: "version",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let version = process.env.npm_package_version;
        
        if (!version) {
            console.warn("Version not available from process. Using package.json instead. Try running bot with \"npm start\"");
            version = require('../../package.json').version;
        }

        message.channel.send(`Version: ${version}`);
    }
}

module.exports = Version;