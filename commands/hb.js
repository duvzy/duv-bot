const fs = require("fs");

module.exports = {
    name: "hb",
    description: "Hardban a un usuario",

    async execute(message, args, client) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("❌ No tienes permiso para usar este comando.");
        }

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        if (!user) {
            return message.reply("⚠️ Menciona a un usuario o pon su ID.");
        }

        try {

            await message.guild.members.ban(user.id, {
                reason: `Hardban por ${message.author.tag}`
            });

            message.channel.send(`🚫 **${user.tag}** fue hardbaneado.`);

        } catch (err) {

            console.error(err);
            message.reply("❌ No pude banear a ese usuario.");

        }

    }
};
