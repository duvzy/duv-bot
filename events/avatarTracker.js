const fs = require("fs");

module.exports = (client) => {

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

};