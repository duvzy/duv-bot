const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

const gifs = [
"https://media.tenor.com/GH7k9u9F8aQAAAAC/anime-kiss.gif",
"https://media.tenor.com/4dL6dX6G8wUAAAAC/anime-kiss.gif",
"https://media.tenor.com/VJ3gXq8dQxEAAAAC/kiss-anime.gif",
"https://media.tenor.com/dJU8s0n8ZKAAAAAC/anime-kiss.gif",
"https://media.tenor.com/1w8E9X8wXxAAAAAC/anime-kiss.gif"
];

module.exports = {
    name: "kiss",

    async execute(message, args, client) {

        const user = message.mentions.users.first();

        if (!user) {
            return message.reply("💋 menciona a alguien para besar");
        }

        if (user.id === message.author.id) {
            return message.reply("😳 no puedes besarte a ti mismo");
        }

        const path = "./kisses.json";

        let data = {};

        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path, "utf8"));
        }

        const key = `${message.author.id}_${user.id}`;

        if (!data[key]) data[key] = 0;

        data[key]++;

        fs.writeFileSync(path, JSON.stringify(data, null, 2));

        const gif = gifs[Math.floor(Math.random() * gifs.length)];

        const embed = new EmbedBuilder()
            .setColor("#ff4da6")
            .setDescription(`💋 **${message.author.username}** besó a **${user.username}**!\n\n💕 Total besos: **${data[key]}**`)
            .setImage(gif);

        const button = new ButtonBuilder()
            .setCustomId(`kissback_${message.author.id}_${user.id}`)
            .setLabel("💋 Besar de vuelta")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }
};