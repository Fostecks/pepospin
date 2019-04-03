const indexExports = require("./index.js");
const Player = require("./player.js");

module.exports = {
    
    shuffleArray: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    play: async function(linkArray, connection, channel) {
        let player = new Player().getInstance();
        await player.killActiveQueue();
        if(linkArray && connection) {
            let shuffledLinkArray = this.shuffleArray(linkArray);
            await player.playArray(shuffledLinkArray, connection, channel).then(() => {
                if(indexExports.bot.killCommand === false) {
                    connection.disconnect();
                }
            });
            
        }
    }
}