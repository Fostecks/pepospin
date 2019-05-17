# pepospin

Discord.js bot for supporting a playlist-style Discord guild

Running:
1. Checkout repository
2. Install [ffmpeg](http://ffmpeg.org/download.html), the library for audio streaming
3. [Create a Discord bot](https://discordapp.com/developers) and invite it to your radio Discord server.
4. Give bot the appropriate read permissions into radio channels and read/write and pin permissions in your bot channel.
4. Create a `config.json` in the root directory of the repository: 
```
{
    "token": "<YOUR_BOT_LOGIN_TOKEN>",
    "prefix": "!",
    "BOT_CLIENT_ID": "<YOUR_BOT_CLIENT_ID>",
    "DISCORD_GUILD_NAME": "<YOUR_DISCORD_SERVER_NAME_HERE>",
    "BOT_CHANNEL_NAME": "bot",
    "TEXT_CHANNEL_BLACKLIST": ["<YOUR>", "<NON>", "<RADIO>", "<CHANNEL>", "<NAMES>", "<HERE>"]
}
```
5. Run `node .`


Useful links:
- Discord API docs: https://discord.js.org
- discord.js-commando guide (wrapper for discord.js for writing commands): https://github.com/discordjs/Commando-guide
- ytdl-core (YouTube streaming library) docs: https://github.com/fent/node-ytdl-core 
