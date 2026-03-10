const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "s",

    async execute(message, args, client) {

        const snipes = client.snipes.get(message.channel.id);

        if (!snipes || snipes.length === 0) {
            return message.reply("No hay mensajes eliminados.");
        }

        const index = args[0] ? parseInt(args[0]) - 1 : 0;

        if (!snipes[index]) {
            return message.reply("⚠️ No hay tantos mensajes eliminados.");
        }

        const snipe = snipes[index];

        const embed = new EmbedBuilder()
            .setAuthor({ name: snipe.author, iconURL: snipe.avatar })
            .setDescription(snipe.content)
            .setColor("Red")
            .setFooter({ text: `Mensaje eliminado (${index + 1})` })
            .setTimestamp(snipe.time);

        if (snipe.image) embed.setImage(snipe.image);
        if (snipe.sticker) embed.setImage(snipe.sticker);

        message.channel.send({ embeds: [embed] });

    }
};
