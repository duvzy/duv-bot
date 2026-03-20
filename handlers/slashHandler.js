const fs = require("fs");
const path = require("path");

async function loadSlash(client) {

    const slashFiles = fs.readdirSync("./slashcommands").filter(file => file.endsWith(".js"));

    for (const file of slashFiles) {

        const command = require(`../slashcommands/${file}`);

        client.slashCommands.set(command.data.name, command);

    }

    console.log("✔ Slash commands cargados");
}

module.exports = { loadSlash };
