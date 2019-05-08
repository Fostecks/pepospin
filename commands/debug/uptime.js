const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");


class Uptime extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "uptime",
            group: "debug",
            memberName: "uptime",
            description: "uptime",
            guildOnly: true
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let now = Date.now();
        let botStart = indexExports.bot.birthdate;
        let days = parseInt((now - botStart)/(24*60*60*1000));
        let hours = parseInt((now - botStart)/(60*60*1000)) % 24;
        let minutes = parseInt((now - botStart)/(60*1000)) % 60;
        let seconds = parseInt((now - botStart)/(1000)) % 60;

        let uptimeString = "";
        if(days) uptimeString += days + " days ";
        if(hours) uptimeString += hours + " hours ";
        if(minutes) uptimeString += minutes + " minutes ";
        if(seconds) uptimeString += seconds + " seconds";
        message.channel.send(uptimeString);
    }
}

module.exports = Uptime;