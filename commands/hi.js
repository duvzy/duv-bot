const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hi",
    description: "Saluda con gif diferente si es a todos o a alguien",

    async execute(message) {

        if (!message.guild) return;

        const mentionedUser = message.mentions.users.first();

        // GIFs para TODOS
        const gifsAll = [
            "https://c.tenor.com/Q3h6crA__hcAAAAd/tenor.gif"
        ];

        // GIFs para saludo individual
        const gifsUser = [
            "https://c.tenor.com/RVydL_9yULgAAAAd/tenor.gif"
        ];

        let description;
        let randomGif;

        if (mentionedUser) {
            description = `👋 ${message.author} saludó a ${mentionedUser}`;
            randomGif = gifsUser[Math.floor(Math.random() * gifsUser.length)];
        } else {
            description = `👋 ${message.author} saludó a Todos`;
            randomGif = gifsAll[Math.floor(Math.random() * gifsAll.length)];
        }

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(description)
            .setImage(randomGif);

        message.channel.send({ embeds: [embed] });
    }
};