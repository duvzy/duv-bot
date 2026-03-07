const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "banner",
    description: "Muestra el banner de un usuario",
    async execute(message, args) {
        let user;

        // 1️⃣ Si mencionas a alguien
        if (message.mentions.users.size) {
            user = message.mentions.users.first();
        } 
        // 2️⃣ Si pones un ID
        else if (args[0]) {
            try {
                user = await message.client.users.fetch(args[0]);
            } catch {
                return message.channel.send("❌ No pude encontrar ese usuario por ID");
            }
        } 
        // 3️⃣ Si no pones nada, se toma el autor
        else {
            user = message.author;
        }

        // Hacer fetch completo para obtener banner
        const fetchedUser = await message.client.users.fetch(user.id, { force: true });

        if (!fetchedUser.banner) 
            return message.channel.send("❌ Este usuario no tiene banner");

        // Obtener la URL del banner
        const bannerURL = fetchedUser.bannerURL({ size: 1024, dynamic: true });

        // Crear embed con la imagen
        const embed = new EmbedBuilder()
            .setTitle(`Banner de ${fetchedUser.tag}`)
            .setImage(bannerURL)
            .setColor("#5865F2") // color estilo Discord
            .setFooter({ text: `ID: ${fetchedUser.id}` });

        message.channel.send({ embeds: [embed] });
    },
};