module.exports = {
    name: "unban",
    async execute(message, args) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("No tienes permiso para usar este comando.");
        }

        const userId = args[0];

        if (!userId) {
            return message.reply("Pon el id del usuario a desbanear.");
        }

        try {
            await message.guild.members.unban(userId);
            message.reply("✅ Usuario desbaneado correctamente.");
        } catch {
            message.reply("No pude desbanear a ese usuario.");
        }
    }
};