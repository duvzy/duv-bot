const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "unlock",
    description: "Desbloquea el canal",

    async execute(message) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply("❌ No tienes permisos para usar esto");
        }

        const channel = message.channel;

        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: null
        });

        message.reply("🔓 Canal unlock.");
    }
};
