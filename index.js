const Commando = require("discord.js-commando");
const bot = new Commando.Client();
const {prefix, token, linkRegex} = require('./config.json') 
const config = require('./config.json');

const textChannelBlacklist = ["rules", "general", "monstercat-album-art"];
const radioMap = {};

bot.on('message', (message) => {
    //collect new radio
});


bot.on('ready', async () => {
    
    let textChannels = bot.guilds.first().channels.filter(channel => channel.type === "text");

    const daPromise = Promise.all(textChannels
        .filter(textChannel => !textChannelBlacklist.includes(textChannel.name))
        .map(textChannel =>  textChannel.fetchMessages())
    ).then(allMessages => {
        allMessages.forEach(channelMessages => {
            let linkCollection = collectLinks(channelMessages);
            let channelName = channelMessages.array()[1].channel.name;
            if(linkCollection) {
                radioMap[channelName] = linkCollection;
            }
        })
    });

    await daPromise;
    bot.registry.registerGroup("cmd", "Commands");
    bot.registry.registerDefaults();
    bot.registry.registerCommandsIn(__dirname + '/commands');   

    console.log("ready");
});

bot.login(token);


function collectLinks(messages) {
    let linkCollection = [];
    let linkRegex = /https:\/\/[a-zA-Z.0-9\/?=&-_]+/g;
    let messageArray = messages.array();
    
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

module.exports = getMap;

