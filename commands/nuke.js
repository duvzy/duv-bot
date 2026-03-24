const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "nuke",
    description: "Nukea el canal 💣",

    async execute(message) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply("❌ No tienes permisos para usar esto");
        }

        const channel = message.channel;

        try {

            // clonar canal
            const newChannel = await channel.clone();

            // borrar canal original
            await channel.delete();

            // enviar mensaje en el nuevo canal
            newChannel.send(`💣 Canal nukeado por: <@${message.author.id}>`);

        } catch (err) {
            console.error(err);
        }

    }
};