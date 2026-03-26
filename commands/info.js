const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "info",
    description: "Lista de comandos",

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📖 Comandos disponibles")
            .setDescription("Aquí tienes todos los comandos del bot 👇")
            .addFields(

                {
                    name: "💤 AFK",
                    value: "`.afk [motivo]` → Ponerte AFK y avisar cuando te mencionen"
                },

                {
                    name: "🖼️ Usuarios",
                    value:
                    "`.avatar (@usuario)` → Ver avatar\n" +
                    "`.avatars @usuario` → Historial de avatars\n" +
                    "`.banner (@usuario)` → Ver banner\n" +
                    "`.user (@usuario)` → Info del usuario"
                },

                {
                    name: "👮 Moderación",
                    value:
                    "`.ban @usuario` → Banear\n" +
                    "`.hb @usuario` → Hardban\n" +
                    "`.c cantidad` → Borrar mensajes\n" +
                    "`.c @usuario cantidad` → Borrar mensajes de usuario\n" +
                    "`.lock` → Cerrar canal\n" +
                    "`.unlock` → Abrir canal\n" +
                    "`.nuke` → Nukear canal"
                },

                {
                    name: "😂 Interacción",
                    value:
                    "`.hi (@usuario)` → Saludar\n" +
                    "`.hug @usuario` → Abrazar\n" +
                    "`.kiss (@usuario)` / `.k` → Besar"
                },

                {
                    name: "🎭 Roles",
                    value:
                    "`.r create nombre` → Crear rol\n" +
                    "`.r delete nombre` → Eliminar rol\n" +
                    "`.r @usuario nombre` → Dar rol\n" +
                    "`.roles` → Ver roles"
                },

                {
                    name: "🧹 Extras",
                    value:
                    "`.s` / `.cs` → Ver mensajes eliminados\n" +
                    "`.steal` → Robar sticker\n" +
                    "`.server` → Info del servidor\n" +
                    "`.bot` → Info del bot"
                }

            )
            .setFooter({ text: `Solicitado por ${message.author.username}` })
            .setThumbnail(message.client.user.displayAvatarURL());

        // 🔘 botón opcional
        const button = new ButtonBuilder()
            .setLabel("✨ Invitar bot")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1475404094305992876&permissions=8&scope=bot");

        const row = new ActionRowBuilder().addComponents(button);

        message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }
};