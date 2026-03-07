const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Comando de ping!!",
    async execute(client, interaction) {

        const ping = Math.round(client.ws.ping);
        
        const embed = new EmbedBuilder()
            .setColor("#2E2E2E")
            .setDescription(`Ping ${ping}ms`);

        await interaction.reply({ embeds: [embed] });
    }
};