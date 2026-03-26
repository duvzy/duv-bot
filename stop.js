module.exports = {
    name: 'stop',
    aliases: ['leave', 'dc'],
    description: 'Detiene la música y saca al bot del voice',

    async execute(message, args, client) {
        const queue = client.distube.getQueue(message.guild);
        if (!queue) {
            return message.reply('❌ No hay música reproduciéndose.');
        }

        try {
            client.distube.stop(message.guild);
            message.reply('✅ Música detenida y bot desconectado del canal de voz.');
        } catch (err) {
            console.error(err);
            message.reply('❌ Error al detener la música.');
        }
    }
};