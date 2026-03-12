const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");

const gifs = [
    "https://c.tenor.com/nd_M3VFwVD0AAAAd/tenor.gif",
    "https://c.tenor.com/SYsRdiK-T7gAAAAd/tenor.gif",
    "https://c.tenor.com/k_aLQ7SgD04AAAAd/tenor.gif",
    "https://c.tenor.com/yMghDOetsPUAAAAC/tenor.gif",
    "https://c.tenor.com/FGb7ZIMzus8AAAAC/tenor.gif"
];

const FILE = path.resolve(__dirname, "..", "hugs.json");

function readData() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}");
  } catch (e) {
    console.error("Error reading hugs.json:", e);
    return {};
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing hugs.json:", e);
  }
}

module.exports = {
  name: "hug",

  async execute(message, args, client) {
    // 1) Intentar mención -> cache -> fetch(ID)
    let user = message.mentions.users.first();

    if (!user && args[0]) {
      // extraer sólo números (maneja <@!ID>, <@ID> o un ID puro)
      const id = args[0].replace(/\D/g, "");
      if (id.length === 17 || id.length === 18 || id.length === 19) {
        try {
          user = await client.users.fetch(id);
        } catch (e) {
          // no existe o no se pudo fetch
          user = null;
        }
      }
    }

    if (!user) {
      return message.reply("Menciona a alguien o proporciona su ID para abrazar 🤗");
    }

    if (user.id === message.author.id) {
      return message.reply("No puedes abrazarte a ti mismo 🤨");
    }

    // 2) Leer/actualizar datos
    const data = readData();

    const key = `${message.author.id}_${user.id}`;
    if (!data[key]) data[key] = 0;
    data[key]++;

    writeData(data);

    // 3) Embed + botón (customId contiene authorId y targetId)
    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor("Pink")
      .setDescription(`🤗 **${message.author.username}** ha abrazado a **${user.username}**!\n\n💞 Total abrazos: **${data[key]}**`)
      .setImage(gif);

    // customId: hugback_<authorId>_<targetId>
    const customId = `hugback_${message.author.id}_${user.id}`;

    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel("🤗 Abrazar de vuelta")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
