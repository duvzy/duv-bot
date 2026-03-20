const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const commands = [];

const commandFiles = fs.readdirSync("./slashcommands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {

        console.log("🔄 Registrando comandos...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ Comandos registrados");

    } catch (error) {
        console.error(error);
    }
})();