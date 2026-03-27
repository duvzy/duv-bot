module.exports = {
    name: "unhb",
    description: "Quitar hardban",

    async execute(message, args, client) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("❌ No tienes permiso para usar este comando.");
        }

        const userId = args[0];

        if (!userId) {
            return message.reply("⚠️ Pon el ID del usuario.");
        }

        try {

            await message.guild.members.unban(userId);

            message.channel.send(`✅ Usuario con ID **${userId}** fue desbaneado.`);

        } catch (err) {

            console.error(err);
            message.reply("❌ No pude desbanear a ese usuario.");

        }

    }
};