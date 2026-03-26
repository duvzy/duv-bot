const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Reproduce una canción de YouTube',

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            return message.reply('❌ Debes estar en un canal de voz para poner música!');
        }

        if (!args.length) {
            return message.reply('❌ Escribe el nombre de la canción o un link.\nEj: `.p despacito`');
        }

        const query = args.join(' ');
        const guildId = message.guild.id;
        let serverQueue = client.queue.get(guildId);
        if (!serverQueue) {
            serverQueue = {
                songs: [],
                connection: null,
                player: null,
                voiceChannel: null
            };
            client.queue.set(guildId, serverQueue);
        }

        try {
            let song;

            if (playdl.yt_validate(query)) {
                const info = await playdl.video_info(query);
                song = {
                    title: info.video_details.title,
                    url: info.video_details.url,
                    duration: info.video_details.durationRaw
                };
            } else {
                const search = await playdl.search(query, { limit: 1 });
                if (!search || search.length === 0) {
                    return message.reply('❌ No encontré esa canción.');
                }
                const video = search[0];
                song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationRaw || 'En vivo'
                };
            }

            serverQueue.songs.push(song);
            message.reply(`✅ **Añadido a la cola:** ${song.title}`);

            if (!serverQueue.connection) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                serverQueue.connection = connection;
                serverQueue.voiceChannel = voiceChannel;

                const player = createAudioPlayer();
                serverQueue.player = player;

                connection.subscribe(player);

                playSong(message.guild, client);

                player.on(AudioPlayerStatus.Idle, () => {
                    serverQueue.songs.shift();
                    if (serverQueue.songs.length > 0) {
                        playSong(message.guild, client);
                    } else {
                        connection.destroy();
                        client.queue.delete(guildId);
                        message.channel.send("✅ Cola terminada, me salgo del canal.");
                    }
                });

                player.on('error', error => {
                    console.error(error);
                    message.channel.send("❌ Error reproduciendo la canción.");
                    serverQueue.songs.shift();
                    if (serverQueue.songs.length > 0) playSong(message.guild, client);
                });
            }

        } catch (error) {
            console.error("Play Error:", error);
            message.channel.send(`❌ Error: ${error.message || "No pude reproducir"}`);
        }
    }
};

async function playSong(guild, client) {
    const serverQueue = client.queue.get(guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) return;

    const song = serverQueue.songs[0];

    try {
        const stream = await playdl.stream(song.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        serverQueue.player.play(resource);
        serverQueue.textChannel?.send(`🎵 **Reproduciendo ahora:** ${song.title} - \`${song.duration}\``);
    } catch (err) {
        console.error(err);
        serverQueue.songs.shift();
        if (serverQueue.songs.length > 0) playSong(guild, client);
    }
}
