const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "roles",
    description: "Muestra todos los roles del servidor",

    async execute(message) {

        if (!message.guild) {
            return message.reply("❌ Este comando solo funciona en servidores.");
        }

        // Obtener todos los roles excepto @everyone
        const roles = message.guild.roles.cache
            .filter(role => role.id !== message.guild.id)
            .sort((a, b) => b.position - a.position);

        if (!roles.size) {
            return message.reply("❌ No hay roles en este servidor.");
        }

        const roleList = roles.map(role => `${role}`).join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`📜 Roles de ${message.guild.name}`)
            .setDescription(roleList.length > 4000 
                ? "⚠️ Hay demasiados roles para mostrar." 
                : roleList)
            .setColor("#2b2d31")
            .setFooter({ text: `Total de roles: ${roles.size}` });

        await message.channel.send({ embeds: [embed] });
    }
};