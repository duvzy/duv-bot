const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "hi",
    description: "Saluda con estilo 👋",

    async execute(message, args, client) {

        if (!message.guild) return;

        const mentionedUser = message.mentions.users.first();

        // GIFs saludo general
        const gifsAll = [
            "https://c.tenor.com/Ch4VFEjuI7IAAAAC/tenor.gif",
            "https://c.tenor.com/K7pQXG1Mw4wAAAAd/tenor.gif",
            "https://c.tenor.com/Au33azlD04wAAAAC/tenor.gif"
        ];

        // GIFs saludo individual
        const gifsUser = [
            "https://c.tenor.com/5CaHe3cW_soAAAAC/tenor.gif",
            "https://c.tenor.com/9aXyxmnYW7oAAAAC/tenor.gif",
            "https://c.tenor.com/w6DlofljHEYAAAAC/tenor.gif"
        ];

        let description;
        let randomGif;

        // -------------------------
        // SALUDO A USUARIO
        // -------------------------

        if (mentionedUser) {

            randomGif = gifsUser[Math.floor(Math.random() * gifsUser.length)];

            description = `👋 **${message.author.username}** saludó a **${mentionedUser.username}**`;

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setDescription(description)
                .setImage(randomGif);

            const button = new ButtonBuilder()
                .setCustomId(`hiback_${message.author.id}_${mentionedUser.id}`)
                .setLabel("👋 Saludar de vuelta")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            return message.channel.send({
                embeds: [embed],
                components: [row]
            });
        }

        // -------------------------
        // SALUDO A TODOS
        // -------------------------

        randomGif = gifsAll[Math.floor(Math.random() * gifsAll.length)];

        description = `👋 **${message.author.username}** saludó a **todos**`;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setDescription(description)
            .setImage(randomGif);

        message.channel.send({ embeds: [embed] });

    }
};
