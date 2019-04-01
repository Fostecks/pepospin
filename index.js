const Commando = require("discord.js-commando");
const {token} = require('./config.json') 

const bot = new Commando.Client({
    disableEveryone: true,
    unknownCommandResponse: false
});
const BOT_COMMAND_CHANNEL_NAME = "dev";
const textChannelBlacklist = ["rules", "general", "monstercat-album-art"];
const radioMap = {};


/** 
 * Listener method for Discord bot's 'ready' lifecycle event. 
 * On ready, fetches all messages in bot's guild and constructs 
 * a map of radio text channels to youtube links in that text channel. 
 * Also registers commando.js commands under ./cmd/commands dir
 */
bot.on('ready', async () => {
    
    let textChannels = bot.guilds.first().channels
        .filter(channel => channel.type === "text");

    const constructRadioMapPromise = Promise.all(textChannels
        .filter(textChannel => !textChannelBlacklist.includes(textChannel.name))
        .map(textChannel =>  textChannel.fetchMessages())
    ).then(allMessages => {
        allMessages.forEach(channelMessages => {
            let messageArray = channelMessages.array();
            if(messageArray.length === 0) return;
            let linkCollection = collectLinks(messageArray);
            let channelName = messageArray[0].channel.name;
            if(linkCollection) {
                radioMap[channelName] = linkCollection;
            }
        })
    });

    await constructRadioMapPromise;
    bot.registry.registerGroup("cmd", "Commands");
    bot.registry.registerDefaults();
    bot.registry.registerCommandsIn(__dirname + '/commands');   

    console.log("bot ready");
});

bot.login(token);

bot.on('message', (message) => {
    //is message a command
    if(message.content.startsWith('!')) {

        //is message in bot channel
        if(message.channel.name === BOT_COMMAND_CHANNEL_NAME) {
            message.channel.fetchMessages().then((messages) => {
                messages = messages.array().filter(x => x.id !== message.id);
                for(const message of messages) {
                    message.delete();
                }
            })
        }
        //is message not in bot channel
        else {
            message.delete();
        }
    }
    //is message not a command message in bot channel
    else if(message.channel.name === BOT_COMMAND_CHANNEL_NAME) {
        message.delete();
    }
});

/**
 * Given an array containing discord.js Messages, harvests links
 * and returns an array of links.
 * @param {Message[]} messageArray
 */
function collectLinks(messageArray) {
    let linkCollection = [];
    let linkRegex = /https:\/\/[a-zA-Z.0-9\/?=&-_]+/g;
    for(let i = 0; i < messageArray.length; i++) {
        let message = messageArray[i].content;
        let links = message.match(linkRegex);
        if(links) {
            linkCollection = linkCollection.concat(links);
        }
    }
    return linkCollection;
}

function getMap() {
    return radioMap;
}

module.exports = {
    "bot": bot,
    "getMap": getMap
}
