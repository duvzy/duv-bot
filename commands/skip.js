module.exports = {
    name: "skip",
    description: "Salta la canción actual",

    async execute(message) {
        const queue = require("./p").queue;

        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.reply("❌ No hay música.");

        serverQueue.player.stop();
        message.reply("⏭ Canción saltada.");
    }
};