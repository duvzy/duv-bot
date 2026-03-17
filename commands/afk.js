const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "afk",
    description: "Ponerte AFK",

    async execute(message, args) {

        const reason = args.join(" ") || "No especificado";

        const path = "./afk.json";
        let data = {};

        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path, "utf8"));
        }

        data[message.author.id] = {
            reason: reason,
            time: Date.now()
        };

        fs.writeFileSync(path, JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setTitle("[AFK] Who")
            .setDescription(`**Estado ausente establecido.**\n\n**Motivo:** ${reason}`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        message.reply({ embeds: [embed] });
    }
};