const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const utils = require("../../utils.js");


/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * a given text channel name. Requires bot to be connected to a 
 * voice channel.
 */
class Play extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "play",
            group: "cmd",
            memberName: "play",
            description: "play requested radio channel",
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
        let radioTrie = indexExports.getTrie();
        let connection = message.guild.voiceConnection;
        if(radioMap && radioTrie && connection && args) {
            let messages = "";
            let linkArray = [];

            for (let channel of args.split(' ')) {
                if (radioMap[channel]) {
                    linkArray = linkArray.concat(radioMap[channel]);
                } else {
                    let trieResults = radioTrie.find(channel);
                    if (trieResults.length === 1) {
                        linkArray = linkArray.concat(radioMap[trieResults[0]]);
                    } else if (trieResults.length > 1) {
                        messages = messages + "Multiple channels found with that prefix: " + trieResults + "\n";
                    } else {
                        messages = messages + "No channels found for: " + channel + "\n";
                    }
                }
            }

            if (messages.length > 0) {
                message.channel.send(messages);
            } else {
                let shuffledLinkArray = utils.shuffleArray(linkArray);
                utils.play(shuffledLinkArray, connection, message.channel);    
            }
        }
    }
}

module.exports = Play;
