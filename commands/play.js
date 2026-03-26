module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Reproduce música',

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            return message.reply('❌ Debes estar en un canal de voz!');
        }

        if (!args.length) {
            return message.reply('❌ Escribe una canción o link.\nEj: `.p despacito`');
        }

        const query = args.join(' ');

        try {
            const queue = client.distube.getQueue(message.guild);
            if (queue && queue.voiceChannel && queue.voiceChannel.id !== voiceChannel.id) {
                client.distube.stop(message.guild);
            }

            await client.distube.play(voiceChannel, query, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });
        } catch (error) {
            console.error("Play Error:", error);
            message.channel.send(`❌ No pude unirme o reproducir: ${error.message || "Timeout de conexión"}`).catch(() => {});
        }
    }
};
