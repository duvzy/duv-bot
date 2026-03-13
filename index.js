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
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.snipes = new Map();

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

client.on("messageCreate", async message => {

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
// Cargar eventos
// ----------------------

fs.readdirSync("./events").forEach(file => {
    require(`./events/${file}`)(client);
});

// ----------------------

client.on("clientReady", async () => {

    try {

        await loadSlash(client);

        console.log("» | Comandos cargados con éxito");
        console.log(`» | Bot encendido como: ${client.user.tag}`);

    } catch (err) {

        console.error(`» | Error al cargar comandos => ${err}`);

    }

});

client.login(process.env.TOKEN);
