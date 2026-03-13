const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {

    name: "kiss",
    description: "Besa a alguien 💋",

    async execute(message) {

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("Debes mencionar a alguien para besar 💋");
        }

        if (target.bot) {
            return message.reply("No puedes besar bots 🤖");
        }

        if (target.id === message.author.id) {
            return message.reply("No puedes besarte a ti mismo 💀");
        }

        const embed = new EmbedBuilder()
            .setColor("#ff4da6")
            .setDescription(`💋 **${message.author.username}** quiere besar a **${target.username}**\n\n¿Aceptas el beso?`);

        const accept = new ButtonBuilder()
            .setCustomId(`kiss_accept_${message.author.id}_${target.id}`)
            .setLabel("Aceptar 💋")
            .setStyle(ButtonStyle.Success);

        const reject = new ButtonBuilder()
            .setCustomId(`kiss_reject_${message.author.id}_${target.id}`)
            .setLabel("Rechazar ❌")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(accept, reject);

        message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }

};
