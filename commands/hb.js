const fs = require("fs");

module.exports = {
    name: "hb",

    async execute(message, args) {
        
        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("No tienes permiso para usar este comando.");
        }

        const user =
            message.mentions.user.first() ||
            await message.client.user.fetch(args[0]).catch(() => null);

        if (!user) return message.reply("Menciona o pon el ID del usuario.");

        const path = "./hardbans.json";

        let data = {};

        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path));
        }

        data[user.id] = true;

        fs.writeFileSync(path, JSON.stringify(data, null, 2));

        await message.guild.members.ban(user.id, {
            reason: `Harban por ${message.author.tag}`
        });

        message.channel.send(`🚫 ${user.tag} fue hardbaneado.`);
    }
};