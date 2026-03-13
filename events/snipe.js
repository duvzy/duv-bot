module.exports = (client) => {

client.on("messageDelete", message => {

    if (!message.guild) return;
    if (!message.author) return;
    if (message.author.bot) return;

    const snipes = client.snipes.get(message.channel.id) || [];

    const data = {
        content: message.content || "Sin texto",
        author: message.author.tag,
        avatar: message.author.displayAvatarURL({ dynamic: true }),
        image: message.attachments.first()?.url || null,
        sticker: message.stickers.first()?.url || null,
        time: new Date()
    };

    snipes.unshift(data);

    client.snipes.set(message.channel.id, snipes.slice(0, 3));

});

};