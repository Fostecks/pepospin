const Commando = require("discord.js-commando");
const {token, BOT_CLIENT_ID} = require('./config.json') 

const bot = new Commando.Client({
    disableEveryone: true,
    unknownCommandResponse: false,
});

const PRIMARY_DISCORD_GUILD_NAME = "thisisatestserver";
const BOT_CHANNEL_NAME = "bot";
const textChannelBlacklist = ["rules", "general", "monstercat-album-art"];
const LINK_REGEX = /https:\/\/(www\.)?(youtube.com|youtu.be)[a-zA-Z.0-9\/?=&-_]+/g;
const radioMap = {};
let latestBotMessage;
let latestCommandMessage;


bot.login(token);

/*******************************
 *        EVENT HANDLERS       *
 *   responsible for radioMap  *
 ******************************/

/************
 * ON READY *
 ***********/
bot.on('ready', async () => {
    bot.primaryDiscordGuild = bot.guilds.find(guild => guild.name === PRIMARY_DISCORD_GUILD_NAME);
    let textChannels = bot.primaryDiscordGuild.channels.filter(channel => channel.type === "text");

    const constructRadioMapPromise = Promise.all(textChannels
        .filter(textChannel => !textChannelBlacklist.includes(textChannel.name))
        .map(textChannel =>  textChannel.fetchMessages())
    ).then(allMessages => {
        allMessages.forEach(channelMessages => {
            let messageArray = channelMessages.array();
            if(messageArray.length === 0) return;
            let linkCollection = collectLinks(messageArray);
            let channelName = messageArray[0].channel.name;
            if(linkCollection && linkCollection.length > 0) {
                radioMap[channelName] = linkCollection;
            }
        })
    });

    await constructRadioMapPromise;
    bot.registry.registerGroup("cmd", "Commands");
    bot.registry.registerDefaults();
    bot.registry.registerCommandsIn(__dirname + '/commands');   

    console.log("bot ready");

    //pin message with bot commands if there isn't one already
    let botChannel = bot.primaryDiscordGuild.channels.find(channel => channel.name === BOT_CHANNEL_NAME);
    botChannel.fetchPinnedMessages().then(messages => {
        if(!messages || !messages.size) {
            pinHelpMessage(botChannel);
        }
    })
    
});

/******************
 * ON NEW MESSAGE *
 *****************/
bot.on('message', async (message) => {
    if(message.guild.name !== PRIMARY_DISCORD_GUILD_NAME) return;
    //is message in bot channel
    if(message.channel.name === BOT_CHANNEL_NAME) {

        //keep latest command message
        if(message.content.startsWith("!")) {
            latestCommandMessage = message;
        }
        //keep latest bot reply
        else if(message.author.id === BOT_CLIENT_ID) {
            latestBotMessage = message;
        }
        
        //delete every other message
        message.channel.fetchMessages().then(async (messages) => {
            let messagesToDelete = messages.array().filter(x => {
                let isLastCommandMessage = latestCommandMessage && x.id === latestCommandMessage.id;
                let isLastBotMessage = latestBotMessage && x.id === latestBotMessage.id;
                return !isLastCommandMessage && !isLastBotMessage && !x.pinned;
            });

            message.channel.bulkDelete(messagesToDelete);
        })
    }
    //else if message is a new song in a radio channel
    else {
        if(!textChannelBlacklist.includes(message.channel.name)) {
            let links = message.content.match(LINK_REGEX);
            if(links) {
                if(message.channel.name in radioMap) {
                    console.log("Found new link(s) under channel " + message.channel.name);
                    radioMap[message.channel.name] = radioMap[message.channel.name].concat(links);
                }
                else {
                    console.log("Found new link(s) under new channel " + message.channel.name);
                    radioMap[message.channel.name] = links;
                }
            }
        }
    }
});

/*********************
 * ON MESSAGE UPDATE *
 ********************/
bot.on('messageUpdate', (oldMessage, newMessage) => {
    if(oldMessage.guild.name !== PRIMARY_DISCORD_GUILD_NAME) return;
    if(oldMessage.channel.name === BOT_CHANNEL_NAME) return;

    // delete old links
    if(!oldMessage) return;
    let oldLinks = oldMessage.content.match(LINK_REGEX);
    if (oldLinks) {
        for(oldLink of oldLinks) {
            let oldLinkIndex = radioMap[oldMessage.channel.name].indexOf(oldLink);
            if(oldLinkIndex > -1 ) {
                radioMap[oldMessage.channel.name].splice(oldLinkIndex, 1);
            }
        }
    }

    //add new links
    let newLinks = newMessage.content.match(LINK_REGEX);
    if(newLinks) {
        radioMap[newMessage.channel.name] = radioMap[newMessage.channel.name].concat(newLinks);
    }
});

/*********************
 * ON CHANNEL UPDATE *
 ********************/
bot.on('channelUpdate', (oldChannel, newChannel) => {
    if(oldChannel.guild.name !== PRIMARY_DISCORD_GUILD_NAME) return;

    if(oldChannel.name !== newChannel.name) {
        if(radioMap[newChannel] !== undefined) return;
        radioMap[newChannel] = radioMap[oldChannel];
        delete radioMap[oldChannel];
    }
});

/*********************
 * ON MESSAGE DELETE *
 ********************/
bot.on('messageDelete', deletedMessage => {
    if(deletedMessage.guild.name !== PRIMARY_DISCORD_GUILD_NAME) return;
    if(deletedMessage.channel.name === BOT_CHANNEL_NAME) return;

    // delete old links
    let oldLinks = deletedMessage.content.match(LINK_REGEX);
    if (oldLinks) {
        for(oldLink of oldLinks) {
            let oldLinkIndex = radioMap[deletedMessage.channel.name].indexOf(oldLink);
            if(oldLinkIndex > -1 ) {
                radioMap[deletedMessage.channel.name].splice(oldLinkIndex, 1);
            }
        }
    }
});

/*********************
 * ON CHANNEL DELETE *
 ********************/
bot.on('channelDelete', deletedChannel => {
    if(deletedChannel.guild.name !== PRIMARY_DISCORD_GUILD_NAME) return;

    if(radioMap[deletedChannel] === undefined) return;
    
    delete radioMap[deletedChannel];
});

/********************************
 *        PRIVATE HELPERS       *
 *******************************/

function pinHelpMessage(channel) {
    let helpMessage = "```css\n" +
    "[COMMANDS]\n" +
    "1. !join : Joins your voice channel\n" +
    "2. !play <channel> : plays Youtube links from <channel>\n" +
    "3. !random : plays a random <channel>\n" +
    "4. !playall : plays links from every channel\n" +
    "5. !skip : skips currently playing link and plays next link\n" +
    "6. !repeat : play currently playing link again when it ends\n" +
    "7. !leave: end audio stream and leave voice channel\n" +
    "```";
    channel.send(helpMessage).then(message => {
        message.pin();
    });
}


/**
 * Given an array containing discord.js Messages, harvests links
 * and returns an array of links.
 * @param {Message[]} messageArray
 */
function collectLinks(messageArray) {
    let linkCollection = [];
    for(let i = 0; i < messageArray.length; i++) {
        let message = messageArray[i].content;
        let links = message.match(LINK_REGEX);
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
