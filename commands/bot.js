const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "bot",

    async execute(message, args, client) {

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setTitle(`🤖 ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(
`Soy **Duvy**, el bot más clean de Discord. ✨

Estoy diseñado para ayudarte a gestionar servidores con múltiples funciones útiles.  
Puedo **banear, purgear mensajes, gestionar roles, moderar usuarios y mucho más**.

También tengo comandos de utilidad, entretenimiento y herramientas para mejorar la experiencia en tu servidor.

👑 **Creador:** <@1347676057523847249> (duvzy / du5b)
🚀 **Objetivo:** ofrecer herramientas simples, rápidas y elegantes para cualquier comunidad.`
            )
            .addFields(
                {
                    name: "⚙️ Funciones",
                    value: "Moderación • Utilidades • Música • Herramientas de servidor",
                    inline: false
                },
                {
                    name: "📡 Estado",
                    value: "Operativo",
                    inline: true
                },
                {
                    name: "🏷️ Bot",
                    value: `${client.user.tag}`,
                    inline: true
                }
            )
            .setFooter({
                text: `Pedido por ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

    }
};