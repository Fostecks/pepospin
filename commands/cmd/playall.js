const Commando = require("discord.js-commando");
const indexExports = require("../../index.js");
const utils = require("../../utils.js");


/** 
 * Bot command to make discord bot start streaming youtube audio
 * into its connected voice channel using youtube links from
 * ALL text channels. Requires bot to be connected to a 
 * voice channel.
 */
class PlayAll extends Commando.Command {

    constructor(client) { 
        super(client, {
            name: "playall",
            group: "cmd",
            memberName: "playall",
            description: "play a mix from all radio channels",
        });
    }

    /**
     * Method that executes on invocation of command.
     * @param {String} message 
     * @param {String} args 
     */
    async run(message, args) {
        let linkArray = this.buildAllQueue();
        let connection = message.guild.voiceConnection;
        if(connection) {
            utils.play(linkArray, connection, message.channel);
        }
    }

    buildAllQueue() {

        let radioMap = JSON.parse(JSON.stringify(indexExports.getMap()));
        let queue = [];
        let keys = Object.keys(radioMap);

        while(keys.length > 0) {
            let randomRadioName = keys[ keys.length * Math.random() << 0];
            let randomRadio = radioMap[randomRadioName];
            
            if(randomRadio.length > 0) {
                let randomTrack = randomRadio.splice(Math.floor(Math.random()*randomRadio.length), 1);
                queue.push(randomTrack[0]);
            }
            else {
                delete radioMap[randomRadioName];
                keys = Object.keys(radioMap);
            }
        }
        console.log(queue);
        return queue;

    }
}

module.exports = PlayAll;