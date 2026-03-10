module.exports = {
    name: "cs",

    async execute(message, args, client) {

        if (!client.snipes.has(message.channel.id)) {
            return message.reply("No hay mensajes eliminados guardados.");
        }

        client.snipes.delete(message.channel.id);

        message.reply("🧹 Historial de mensajes eliminados borrado.");

    }
};