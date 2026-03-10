const { Client, Collection, GatewayIntentBits, Sticker } = require("discord.js");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");
const { loadSlash } = require("./handlers/slashHandler");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.snipes = new Map();

// 🎵 DisTube
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new YouTubePlugin()]
});

// ----------------------
// Avatar history
// ----------------------
client.on("userUpdate", async (oldUser, newUser) => {
    if (oldUser.avatar === newUser.avatar) return;

    const dataPath = "./avatarTracker.json";
    let data = {};
    if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }

    if (!data[newUser.id]) data[newUser.id] = [];

    data[newUser.id].push({
        url: oldUser.displayAvatarURL({ dynamic: true, size: 1024 }),
        changedAt: new Date().toISOString()
    });

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});

// ----------------------
// Cargar comandos
// ----------------------
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// ----------------------
// Prefijo
// ----------------------
const prefix = ".";

client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    command.execute(message, args, client);
});

// ----------------------
// Snipe mensajes borrados
// ----------------------

client.on("messageDelete", message => {

    if (!message.guild) return;
    if (!message.author) return;
    if (message.author.bot) return;

    const snipes = client.snipes.get(message.channel.id) || [];

    const data = {
        content: message.content || "Sin texto",
        author: message.author.tag,
        avatar: message.author.displayAvatarURL({ dynamic: true }),
        image: message.attachments.first()?.url || null,
        sticker: message.stickers.first()?.url || null,
        time: new Date()
    };

    snipes.unshift(data);

    client.snipes.set(message.channel.id, snipes.slice(0, 3));

});

// ----------------------
// Eventos de música
// ----------------------

client.distube
.on("playSong", (queue, song) =>
    queue.textChannel.send(`🎵 Reproduciendo **${song.name}**`)
)
.on("addSong", (queue, song) =>
    queue.textChannel.send(`➕ Añadido **${song.name}** a la cola`)
)
.on("error", (channel, e) => {
    console.error(e);
    channel.send("❌ Error reproduciendo música");
});

// ----------------------
// Login
// ----------------------

client.login(process.env.TOKEN);

client.on("ready", async () => {

    try {
        await loadSlash(client);
        console.log("» | Comandos cargados con éxito");
        console.log(`» | Bot encendido como: ${client.user.tag}`);

    } catch (err) {
        console.error(`» | Error al cargar comandos => ${err}`);
    }

});
