const { 
EmbedBuilder, 
ActionRowBuilder, 
ButtonBuilder, 
ButtonStyle 
} = require("discord.js");

const fs = require("fs");

const gifs = [
"https://media.tenor.com/0AVbKGY_MxMAAAAC/anime-hug.gif",
"https://media.tenor.com/ZzorehuOxt8AAAAC/hug-anime.gif",
"https://media.tenor.com/OXCV_qL-V60AAAAC/mochi-mochi-peach-cat-hug.gif",
"https://media.tenor.com/jU9c9w82GKAAAAAC/love-hug.gif",
"https://media.tenor.com/wOmoeFj1YdAAAAAC/hug-anime.gif"
];

module.exports = {
    name: "hug",

    async execute(message, args, client) {

        const user = message.mentions.users.first();
        if (!user) return message.reply("Menciona a alguien para abrazar.");

        if (user.id === message.author.id)
        return message.reply("No puedes abrazarte a ti mismo 🤨");

        const path = "./hugs.json";

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
            .setColor("Pink")
            .setDescription(`🤗 **${message.author.username}** ha abrazado a **${user.username}**!\n\n💞 Total abrazos: **${data[key]}**`)
            .setImage(gif);

        const button = new ButtonBuilder()
            .setCustomId(`hugback_${message.author.id}`)
            .setLabel("🤗 Abrazar de vuelta")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }
};
};
