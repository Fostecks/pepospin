const Commando = require("discord.js-commando");
const bot = new Commando.Client();
const {prefix, token} = require('./config.json') 
const config = require('./config.json');

bot.registry.registerGroup("cmd", "Commands");
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + '/commands');

bot.on('message', (message) => {
    if(message.content.startsWith('!')) {
        // message.channel.send(":thinking:");
    }
});

bot.on('ready', () => {
    console.log('ready');
    
    let textChannels = bot.guilds.first().channels.filter((channel) => {
        return channel.type === "text";
    });
    
    textChannels.first().fetchMessages().then(messages => {
        messages.array().forEach(message => {
            // console.log(message.content);
        })
    });

})


bot.login(token);

//552706683978252365