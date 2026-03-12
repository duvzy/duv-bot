// ./commands/hug.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const pathFile = "./hugs.json";

const gifs = [
  "https://c.tenor.com/nd_M3VFwVD0AAAAd/tenor.gif",
  "https://c.tenor.com/SYsRdiK-T7gAAAAd/tenor.gif",
  "https://c.tenor.com/k_aLQ7SgD04AAAAd/tenor.gif",
  "https://c.tenor.com/yMghDOetsPUAAAAC/tenor.gif",
  "https://c.tenor.com/FGb7ZIMzus8AAAAC/tenor.gif"
];

module.exports = {
  name: "hug",
  async execute(message, args, client) {
    try {
      // BUSCAR USUARIO: acepta mención o ID
      let user = message.mentions.users.first();
      if (!user && args[0]) {
        const id = args[0].replace(/[<@!>]/g, "");
        try { user = await client.users.fetch(id); } catch {}
      }

      if (!user) {
        return message.reply("Menciona a alguien para abrazar 🤗");
      }

      if (user.id === message.author.id) {
        return message.reply("No puedes abrazarte a ti mismo, pero buen intento 😂");
      }

      // LEER/CREAR hugs.json
      let data = {};
      if (fs.existsSync(pathFile)) {
        try {
          data = JSON.parse(fs.readFileSync(pathFile, "utf8") || "{}");
        } catch (err) {
          console.error("Error leyendo hugs.json:", err);
          data = {};
        }
      }

      const key = `${message.author.id}_${user.id}`;
      data[key] = (data[key] || 0) + 1;

      try {
        fs.writeFileSync(pathFile, JSON.stringify(data, null, 2), "utf8");
      } catch (err) {
        console.error("Error escribiendo hugs.json:", err);
        // no abortamos: queremos que el embed se mande aunque falle el guardado
      }

      const gif = gifs[Math.floor(Math.random() * gifs.length)];

      const embed = new EmbedBuilder()
        .setColor("#ff69b4")
        .setDescription(`🤗 **${message.author.username}** ha abrazado a **${user.username}**!\n\n💞 Total abrazos: **${data[key]}**`)
        .setImage(gif);

      // CUSTOM ID: tiene ambos ids para que el handler del botón pueda validar
      const customId = `hugback_${message.author.id}_${user.id}`;

      const button = new ButtonBuilder()
        .setCustomId(customId)
        .setLabel("🤗 Abrazar de vuelta")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      console.log(`HUG: ${message.author.id} -> ${user.id}  (count ${data[key]})`);
      await message.channel.send({ embeds: [embed], components: [row] });

    } catch (err) {
      console.error("Error en comando hug:", err);
      return message.reply("Ocurrió un error al intentar abrazar.");
    }
  }
};
