module.exports = (client) => {

client.on("guildMemberAdd", async member => {

    const accountAge = Date.now() - member.user.createdTimestamp;

    const days7 = 1000 * 60 * 60 * 24 * 7;

    if (accountAge < days7) {

        try {

            await member.ban({
                reason: "Posible evasión de ban / cuenta muy nueva"
            });

            console.log(`⚠️ Alt detectada y baneada: ${member.user.tag}`);

        } catch (err) {

            console.log("Error baneando alt:", err);

        }

    }

});

};