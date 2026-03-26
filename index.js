const { Client, Collection, GatewayIntentBits } = require("discord.js");
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
client.queue = new Map();

// ----------------------
// CARGAR EVENTOS
// ----------------------
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client);
}

// ----------------------
// CARGAR COMANDOS
// ----------------------
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// ----------------------
// PREFIJO
// ----------------------
const prefix = ".";

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (err) {
        console.error("Error en comando:", err);
        message.channel.send("❌ Ocurrió un error.").catch(() => {});
    }
});

// ----------------------
// SLASH COMMANDS
// ----------------------
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (err) {
        console.error(err);
        interaction.reply({ content: "❌ Error ejecutando comando", ephemeral: true }).catch(() => {});
    }
});

// ----------------------
// READY
// ----------------------
client.on("clientReady", async () => {
    try {
        await loadSlash(client);
        console.log(`» | Bot encendido como: ${client.user.tag}`);
    } catch (err) {
        console.error(`Error cargando slash => ${err}`);
    }
});

// ====================
// TRACKING DE STATS 
// ====================
client.userStats = new Map();
client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    if (!client.userStats.has(guildId)) client.userStats.set(guildId, new Map());
    const guildStats = client.userStats.get(guildId);

    if (!guildStats.has(userId)) guildStats.set(userId, { messages: 0, voiceTime: 0, joinVoiceTime: null });

    const userData = guildStats.get(userId);
    userData.messages++;
});

client.on("voiceStateUpdate", (oldState, newState) => {
    const guildId = newState.guild.id;
    const userId = newState.id;

    if (!client.userStats.has(guildId)) client.userStats.set(guildId, new Map());
    const guildStats = client.userStats.get(guildId);

    if (!guildStats.has(userId)) guildStats.set(userId, { messages: 0, voiceTime: 0, joinVoiceTime: null });

    const userData = guildStats.get(userId);

    if (!oldState.channelId && newState.channelId) {
        userData.joinVoiceTime = Date.now();
    }
    else if (oldState.channelId && !newState.channelId) {
        if (userData.joinVoiceTime) {
            const timeSpent = Date.now() - userData.joinVoiceTime;
            userData.voiceTime += timeSpent;
            userData.joinVoiceTime = null;
        }
    }
});

client.login(process.env.TOKEN);
