module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Reproduce una canción de YouTube o busca por nombre',

    async execute(message, args, client) {
        if (!message.member.voice.channel) {
            return message.reply('❌ Debes estar en un **canal de voz** para poner música!');
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply('❌ Escribe el nombre de la canción o el link.\nEjemplo: `.p despacito` o `.p https://youtu.be/...`');
        }

        try {
            // DisTube se encarga de todo: buscar + unirse al voice + reproducir
            await client.distube.play(message.member.voice.channel, query, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });

            // El mensaje de "Añadido" o "Reproduciendo" lo maneja automáticamente 
            // gracias a los eventos que ya tienes en el index.js

        } catch (error) {
            console.error(error);
            message.reply('❌ Error al intentar reproducir la música. Intenta con otro link o nombre.');
        }
    }
};
