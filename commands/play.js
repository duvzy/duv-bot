module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Reproduce música de YouTube',

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            return message.reply('❌ Debes estar en un canal de voz para poner música!');
        }

        if (!args.length) {
            return message.reply('❌ Escribe el nombre de la canción o un link de YouTube.\nEj: `.p despacito`');
        }

        const query = args.join(' ');

        try {
            await client.distube.play(voiceChannel, query, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });
        } catch (error) {
            console.error("Error en play:", error);
            if (message.channel) {
                message.channel.send(`❌ Error: ${error.message || "No pude reproducir la canción"}`).catch(() => {});
            }
        }
    }
};
