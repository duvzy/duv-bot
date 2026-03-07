const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "c",
    description: "Borra mensajes del canal",

    async execute(message, args) {
        if (!message.guild) return;

        // Permisos usuario
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ No tienes permiso para borrar mensajes.");
        }

        // Permisos bot
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ No tengo permiso para borrar mensajes.");
        }

        if (!args[0]) {
            return message.reply("❌ Usa `.c cantidad` o `.c @usuario cantidad`");
        }

        let amount;
        let targetUser;

        // Si mencionan usuario
        if (message.mentions.users.first()) {
            targetUser = message.mentions.users.first();
            amount = parseInt(args[1]);
        } else {
            amount = parseInt(args[0]);
        }

        if (!amount || amount <= 0 || amount > 100) {
            return message.reply("❌ Debes poner un número entre 1 y 100.");
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });

            let filtered = messages;

            // Si es limpieza por usuario
            if (targetUser) {
                filtered = messages.filter(msg => msg.author.id === targetUser.id);
            }

            const messagesToDelete = filtered.first(amount);

            await message.channel.bulkDelete(messagesToDelete, true);

            const confirmMsg = await message.channel.send(
                `🧹 Se eliminaron ${messagesToDelete.length} mensajes` +
                (targetUser ? ` de ${targetUser.tag}` : "")
            );

            setTimeout(() => confirmMsg.delete().catch(() => {}), 3000);

        } catch (error) {
            console.error(error);
            message.reply("❌ No pude borrar los mensajes (pueden ser muy antiguos).");
        }
    }
};