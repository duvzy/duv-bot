const axios = require("axios");

module.exports = {
    name: "steal",
    async execute(message) {

        if (!message.member.permissions.has("ManageGuildExpressions")) {
            return message.reply("No tienes permisos para robar stickers.");
        }

        if (!message.reference) {
            return message.reply("Responde a un mensaje que tenga un sticker.");
        }

        const replied = await message.channel.messages.fetch(message.reference.messageId);

        if (!replied.stickers.size) {
            return message.reply("Ese mensaje no tiene stickers.");
        }

        const sticker = replied.stickers.first();

        try {

            const response = await axios.get(sticker.url, { responseType: "arraybuffer" });

            await message.guild.stickers.create({
                file: response.data,
                name: sticker.name,
                tags: "stolen"
            });

            message.reply(`Sticker **${sticker.name}** robado.`);

        } catch (error) {
            console.error(error);
            message.reply("No pude robar ese sticker.");
        }
    }
};