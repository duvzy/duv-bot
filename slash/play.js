const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Reproduce música 🎵")
        .addStringOption(option =>
            option
                .setName("cancion")
                .setDescription("Nombre o link de la canción")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        const song = interaction.options.getString("cancion");

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: "❌ Debes estar en un canal de voz",
                ephemeral: true
            });
        }

        try {

            await interaction.reply(`🔎 Buscando: **${song}**`);

            await client.distube.play(voiceChannel, song, {
                textChannel: interaction.channel,
                member: interaction.member
            });

        } catch (err) {

            console.log(err);

            interaction.followUp("❌ Error al reproducir");

        }

    }
};