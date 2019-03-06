const Commando = require("discord.js-commando");

class CoinFlip extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "flip",
            group: "cmd",
            memberName: "flip",
            description: "flips a coin",

        });
    }

    async run(message, args) {
        let chance = Math.floor(Math.random() * 2);
        message.channel.send((message === 0) ? "Heads" : "Tails")
        message.delete();
    }
}

module.exports = CoinFlip;