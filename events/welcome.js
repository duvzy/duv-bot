const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {

    // Comando para configurar el canal de bienvenida
    client.on("messageCreate", async (message) => {
        if (!message.content.startsWith('.setwelcome') || message.author.bot) return;

        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Solo administradores pueden usar este comando.');
        }

        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('❌ Usa: `.setwelcome #canal`');

        if (!client.welcomeChannel) client.welcomeChannel = new Map();
        client.welcomeChannel.set(message.guild.id, channel.id);

        message.reply(`✅ Canal de bienvenida configurado: ${channel}`);
    });

    // Bienvenida automática
    client.on("guildMemberAdd", async (member) => {
        if (!client.welcomeChannel) return;

        const welcomeChannelId = client.welcomeChannel.get(member.guild.id);
        if (!welcomeChannelId) return;

        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#ff00ff')
            .setTitle(`¡Bienvenido/a a ${member.guild.name}! 🎉`)
            .setDescription(`Hola **${member.user.tag}**, somos **${member.guild.memberCount}** miembros ahora.\n¡Disfruta y sobre todo debes ser un papu pro six seven!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setImage('https://c.tenor.com/tJO6kM3FePUAAAAC/tenor.gif')
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    });
};
