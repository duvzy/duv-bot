module.exports = {
    name: "avatar",
    execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        message.reply(user.displayAvatarURL({ size: 1024, dynamic: true }));
    }
};