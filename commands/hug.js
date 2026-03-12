const { 
EmbedBuilder, 
ActionRowBuilder, 
ButtonBuilder, 
ButtonStyle 
} = require("discord.js");

const fs = require("fs");

const gifs = [
"https://c.tenor.com/nd_M3VFwVD0AAAAd/tenor.gif",
"https://c.tenor.com/SYsRdiK-T7gAAAAd/tenor.gif",
"https://c.tenor.com/k_aLQ7SgD04AAAAd/tenor.gif",
"https://c.tenor.com/yMghDOetsPUAAAAC/tenor.gif",
"https://c.tenor.com/FGb7ZIMzus8AAAAC/tenor.gif"
];

module.exports = {
    name: "hug",

    async execute(message, args, client) {

        const user = message.mentions.users.first();
        if (!user) return message.reply("Menciona a alguien para abrazar.");

        const path = "./hugs.json";

        let data = {};
        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path));
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