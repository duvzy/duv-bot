module.exports = {
    name: "ban",
    async execute(message, args) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("No tienes permiso para usar este comando.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Menciona a alguien para banear.");

        try {
            await member.ban();
            message.reply(`${member.user.tag} fue baneado.`);
        } catch {
            message.reply("No puedo banear a este usuario.");
        }
    }
};