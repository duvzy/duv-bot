const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "avatars",
    description: "Muestra el historial de avatares",

    async execute(message, args) {

        let user;

        // 1️⃣ Si mencionan a alguien
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        }

        // 2️⃣ Si escriben algo después del comando
        else if (args.length > 0) {

            const input = args.join(" ").toLowerCase();

            // Intentar por ID
            user = await message.client.users.fetch(input).catch(() => null);

            // Intentar por username
            if (!user) {
                const member = message.guild.members.cache.find(m =>
                    m.user.username.toLowerCase() === input
                );

                if (member) user = member.user;
            }
        }

        // 3️⃣ Si no ponen nada → usar el autor
        if (!user) {
            user = message.author;
        }

        if (!user) {
            return message.reply("❌ Usuario no encontrado");
        }

        const dataPath = "./avatarTracker.json";
        let data = {};

        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        }

        const avatarHistory = data[user.id] || [];

        // Lista de URLs
        const avatars = avatarHistory.map(a => a.url);

        // Agregar avatar actual
        avatars.push(user.displayAvatarURL({ dynamic: true, size: 1024 }));

        if (avatars.length === 0) {
            return message.reply("❌ No hay avatares guardados");
        }

        // Enviar cada avatar en un embed
        for (let i = 0; i < avatars.length; i++) {

            const embed = new EmbedBuilder()
                .setTitle(`🖼️ Avatar ${i + 1} de ${user.tag}`)
                .setColor("#2b2d31")
                .setImage(avatars[i]);

            await message.channel.send({ embeds: [embed] });
        }
    }
};