const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'user',
    aliases: ['userinfo', 'whois', 'info'],
    description: 'Muestra información detallada del usuario',

    async execute(message, args, client) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (!member) return message.reply('❌ No encontré a ese usuario.');

        const guildId = message.guild.id;
        const userId = member.id;

        const stats = client.userStats.get(guildId)?.get(userId) || { messages: 0, voiceTime: 0 };

        const voiceHours = Math.floor(stats.voiceTime / 3600000) || 0;

        const embed = new EmbedBuilder()
            .setColor('#00ff88')
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '🆔 ID', value: `\`${member.id}\``, inline: true },
                { name: '📅 Ingresó al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '🌐 Cuenta creada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '💬 Mensajes enviados', value: `\`${stats.messages}\``, inline: true },
                { name: '🎙️ Horas en vc', value: `\`${voiceHours}\` horas`, inline: true },
                { name: '👑 Roles', value: member.roles.cache.size > 1 
                    ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r).join(' ') 
                    : 'Ninguno', inline: false }
            )
            .setFooter({ text: `Solicitado por ${message.author.tag}` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};