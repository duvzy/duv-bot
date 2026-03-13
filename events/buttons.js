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
// BOTON KISS ACEPTAR
//

if (interaction.customId.startsWith("kiss_accept_")) {

const parts = interaction.customId.split("_");

const authorId = parts[2];
const targetId = parts[3];

if (interaction.user.id !== targetId) {
return interaction.reply({
content: "Solo la persona mencionada puede responder 💀",
ephemeral: true
});
}

const target = await client.users.fetch(authorId);

const path = "./kisses.json";

let data = {};

if (fs.existsSync(path)) {
data = JSON.parse(fs.readFileSync(path,"utf8"));
}

const key = `${interaction.user.id}_${target.id}`;

if (!data[key]) data[key] = 0;

data[key]++;

fs.writeFileSync(path, JSON.stringify(data,null,2));

const gifs = [
"https://c.tenor.com/SZ8-4vDwi6cAAAAC/tenor.gif",
"https://c.tenor.com/_JqioiurJwIAAAAd/tenor.gif",
"https://c.tenor.com/ebi-Gt7Rr_IAAAAd/tenor.gif"
];

const gif = gifs[Math.floor(Math.random()*gifs.length)];

const embed = new EmbedBuilder()
.setColor("#ff4da6")
.setDescription(`💋 **${interaction.user.username}** aceptó el beso de **${target.username}**!\n\n💕 Total besos: **${data[key]}**`)
.setImage(gif);

return interaction.update({
embeds:[embed],
components:[]
});

}

//
// BOTON KISS RECHAZAR
//

if (interaction.customId.startsWith("kiss_reject_")) {

const parts = interaction.customId.split("_");

const authorId = parts[2];
const targetId = parts[3];

if (interaction.user.id !== targetId) {
return interaction.reply({
content: "Solo la persona mencionada puede responder 💀",
ephemeral: true
});
}

const target = await client.users.fetch(authorId);

const gifs = [
"https://c.tenor.com/XiYuU9h44-AAAAAC/tenor.gif",
"https://c.tenor.com/Sv8LQZAoQmgAAAAC/tenor.gif",
"https://c.tenor.com/7xFcP1KWjY0AAAAC/tenor.gif"
];

const gif = gifs[Math.floor(Math.random()*gifs.length)];

const embed = new EmbedBuilder()
.setColor("#ff0000")
.setDescription(`❌ **${interaction.user.username}** rechazó el beso de **${target.username}**`)
.setImage(gif);

return interaction.update({
embeds:[embed],
components:[]
});

}

});
};
