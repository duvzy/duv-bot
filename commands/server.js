const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "server",

    async execute(message,args, client) {

        const guild = message.guild;
        
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setTitle(`📊 ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                {
                    name: "👑 Dueño",
                    value: `${owner.user.tag}`,
                    inline: true
                },
                {
                    name: "🆔 ID del servidor",
                    value: guild.id,
                    inline: true
                },
                {
                    name: "📅 Creado",
                    value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: "👥 Miembros",
                    value: `${guild.memberCount}`,
                    inline: true
                },
                {
                    name: "💬 Canales",
                    value: `${guild.channels.cache.size}`,
                    inline: true
                },
                {
                    name: "🎭 Roles",
                    value: `${guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: "😀 Emojis",
                    value: `${guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: "🚀 Boosts",
                    value: `Nivel ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boosts)`,
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
