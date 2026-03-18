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
                const diff = Date.now() - afkData.time;

                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);

                let time;

                if (hours > 0) {
                    time = `${hours}h ${minutes % 60}m`;
                } else if (minutes > 0) {
                    time = `${minutes}m ${seconds % 60}s`;
                } else {
                    time = `${seconds}s`;
                }

                message.reply(
                `💤 **${user.username}** está AFK
                Motivo: ${afkData.reason}
                Hace: ${time}`
                );
            }

        });

    });

};
