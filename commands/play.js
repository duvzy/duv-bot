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
            return message.reply('❌ Escribe el nombre de la canción o un link.\nEjemplo: `.p despacito`');
        }

        const query = args.join(' ');

        try {
            const existingQueue = client.distube.getQueue(message.guild.id);
            if (existingQueue) {
                client.distube.stop(message.guild.id);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            message.reply(`🔄 Buscando y reproduciendo: **${query}**...`);

            await client.distube.play(voiceChannel, query, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });

        } catch (error) {
            console.error("Play Error:", error);
            message.channel.send(`❌ Error: ${error.message || "No pude conectar al canal de voz"}`).catch(() => {});
        }
    }
};
