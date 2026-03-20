const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Reproduce música")
        .addStringOption(option =>
            option.setName("cancion")
                .setDescription("Nombre o URL")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        await interaction.deferReply(); // 🔥 IMPORTANTE

        const song = interaction.options.getString("cancion");

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply("❌ Debes estar en un canal de voz");
        }

        try {

            await client.distube.play(voiceChannel, song, {
                textChannel: interaction.channel,
                member: interaction.member
            });

            await interaction.editReply(`🎶 Reproduciendo: **${song}**`);

        } catch (e) {

            console.error(e);
            interaction.editReply("❌ Error al reproducir");

        }

    }
};
