const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = (client) => {

client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

//
// BOTON HUG
//

if (interaction.customId.startsWith("hugback_")) {

const parts = interaction.customId.split("_");

const authorId = parts[1];
const targetId = parts[2];

if (interaction.user.id !== targetId) {
return interaction.reply({
content: "Solo la persona abrazada puede usar este botón 🤗",
ephemeral: true
});
}

const target = await client.users.fetch(authorId);

const path = "./hugs.json";

let data = {};

if (fs.existsSync(path)) {
data = JSON.parse(fs.readFileSync(path, "utf8"));
}

const key = `${interaction.user.id}_${target.id}`;

if (!data[key]) data[key] = 0;

data[key]++;

fs.writeFileSync(path, JSON.stringify(data, null, 2));

const gifs = [
"https://c.tenor.com/nd_M3VFwVD0AAAAd/tenor.gif",
"https://c.tenor.com/SYsRdiK-T7gAAAAd/tenor.gif",
"https://c.tenor.com/k_aLQ7SgD04AAAAd/tenor.gif",
"https://c.tenor.com/yMghDOetsPUAAAAC/tenor.gif"
];

const gif = gifs[Math.floor(Math.random() * gifs.length)];

const embed = new EmbedBuilder()
.setColor("#ff69b4")
.setDescription(`🤗 **${interaction.user.username}** ha abrazado de vuelta a **${target.username}**!\n\n💞 Total abrazos: **${data[key]}**`)
.setImage(gif);

return interaction.reply({ embeds: [embed] });

}

//
// BOTON HI
//

if (interaction.customId.startsWith("hiback_")) {

const parts = interaction.customId.split("_");

const authorId = parts[1];
const targetId = parts[2];

if (interaction.user.id !== targetId) {
return interaction.reply({
content: "Solo la persona saludada puede devolver el saludo 👀",
ephemeral: true
});
}

const target = await client.users.fetch(authorId);

const gifs = [
"https://media.tenor.com/J7eGDvGeP9IAAAAC/anime-hi.gif",
"https://media.tenor.com/YtwEoWZ6qOAAAAAC/hello-hi.gif",
"https://media.tenor.com/Qs9n1bR8h3gAAAAC/hello-anime.gif"
];

const gif = gifs[Math.floor(Math.random() * gifs.length)];

const embed = new EmbedBuilder()
.setColor("#5865F2")
.setDescription(`👋 **${interaction.user.username}** saludó de vuelta a **${target.username}**`)
.setImage(gif);

return interaction.reply({ embeds: [embed] });

}

//
// BOTON KISS
//

if (interaction.customId.startsWith("kissback_")) {

const parts = interaction.customId.split("_");

const authorId = parts[1];
const targetId = parts[2];

if (interaction.user.id !== targetId) {
return interaction.reply({
content: "Solo la persona besada puede devolver el beso 💋",
ephemeral: true
});
}

const target = await client.users.fetch(authorId);

const path = "./kisses.json";

let data = {};

if (fs.existsSync(path)) {
data = JSON.parse(fs.readFileSync(path, "utf8"));
}

const key = `${interaction.user.id}_${target.id}`;

if (!data[key]) data[key] = 0;

data[key]++;

fs.writeFileSync(path, JSON.stringify(data, null, 2));

const gifs = [
"https://media.tenor.com/GH7k9u9F8aQAAAAC/anime-kiss.gif",
"https://media.tenor.com/4dL6dX6G8wUAAAAC/anime-kiss.gif",
"https://media.tenor.com/VJ3gXq8dQxEAAAAC/kiss-anime.gif"
];

const gif = gifs[Math.floor(Math.random() * gifs.length)];

const embed = new EmbedBuilder()
.setColor("#ff4da6")
.setDescription(`💋 **${interaction.user.username}** besó de vuelta a **${target.username}**!\n\n💕 Total besos: **${data[key]}**`)
.setImage(gif);

return interaction.reply({ embeds: [embed] });

}

});

};