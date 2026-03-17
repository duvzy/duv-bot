const fs = require("fs");

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (!message.guild || message.author.bot) return;

        if (message.content.startsWith(".afk")) return;

        const path = "./afk.json";
        let data = {};

        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path, "utf8"));
        }

        // ❌ Quitar AFK si habla
        if (data[message.author.id]) {

            delete data[message.author.id];

            fs.writeFileSync(path, JSON.stringify(data, null, 2));

            message.reply("👋 Ya no estás AFK");
        }

        // 👀 Detectar menciones
        message.mentions.users.forEach(user => {

            if (data[user.id]) {

                const afkData = data[user.id];
                const time = Math.floor((Date.now() - afkData.time) / 1000);

                message.reply(
                    `💤 **${user.username}** está AFK\nMotivo: ${afkData.reason}\nHace: ${time}s`
                );
            }

        });

    });

};
