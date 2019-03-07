const Commando = require("discord.js-commando");
const bot = new Commando.Client();
const {prefix, token, linkRegex} = require('./config.json') 
const config = require('./config.json');

bot.registry.registerGroup("cmd", "Commands");
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + '/commands');

const nonRadioTextChannels = ["rules", "general", "deaf-radio", "monstercat-album-art"];
const radioMap = {};

bot.on('message', (message) => {
    //collect new radio
});

bot.on('ready', () => {
    console.log('ready');
    
    let textChannels = bot.guilds.first().channels.filter((channel) => {
        return channel.type === "text";
    });

    textChannels.forEach(textChannel => {
        if(!nonRadioTextChannels.includes(textChannel)) {
            textChannel.fetchMessages().then(messages => {
                let linkCollection = collectLinks(messages);
                radioMap[textChannel.name] = linkCollection;
            });
        }
    });
    
})

bot.login(token);


function collectLinks(messages) {
    let linkCollection = [];
    let linkRegex = /https:\/\/[a-zA-Z.0-9\/?=&-_]+/g;
    let messageArray = messages.array()
    
    for(let i = 0; i < messageArray.length; i++) {
        let message = messageArray[i];
        let links = message.content.match(linkRegex);
        if(links) {
            linkCollection = linkCollection.concat(links);
        }
    }

    return linkCollection;
}