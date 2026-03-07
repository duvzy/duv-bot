module.exports = {
    name: "p",
    description: "Reproduce música",

    async execute(message, args, client) {

        if (!message.member.voice.channel) {
            return message.reply("❌ Debes estar en un canal de voz.");
        }

        const query = args.join(" ");
        if (!query) {
            return message.reply("❌ Escribe una canción.");
        }

        client.distube.play(message.member.voice.channel, query, {
            textChannel: message.channel,
            member: message.member
        });

    }
};