const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Reproduce música de YouTube (solo links por ahora)',

    async execute(message, args, client) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            return message.reply('❌ Debes estar en un canal de voz!');
        }

        if (!args.length) {
            return message.reply('❌ Pega el **link completo** de YouTube.\nEjemplo: `.p https://youtu.be/dQw4w9wgxcq`');
        }

        const query = args.join(' ');
        const guildId = message.guild.id;

        let serverQueue = client.queue.get(guildId);
        if (!serverQueue) {
            serverQueue = { songs: [], connection: null, player: null };
            client.queue.set(guildId, serverQueue);
        }

        try {

            if (!ytdl.validateURL(query)) {
                return message.reply('❌ Por ahora solo soporto **links directos** de YouTube.\nBúsqueda por nombre no funciona bien todavía.');
            }

            const songInfo = await ytdl.getInfo(query);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: songInfo.videoDetails.lengthSeconds
            };

            serverQueue.songs.push(song);
            message.reply(`✅ **Añadido:** ${song.title}`);

            if (!serverQueue.connection) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                serverQueue.connection = connection;
                serverQueue.player = createAudioPlayer();
                connection.subscribe(serverQueue.player);

                playSong(guildId, client);
            }

        } catch (error) {
            console.error("Play Error:", error);
            message.channel.send(`❌ Error: ${error.message || "No pude obtener la canción"}`);
        }
    }
};

async function playSong(guildId, client) {
    const serverQueue = client.queue.get(guildId);
    if (!serverQueue || serverQueue.songs.length === 0) return;

    const song = serverQueue.songs[0];

    try {
        const stream = ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        const resource = createAudioResource(stream, { inlineVolume: true });
        serverQueue.player.play(resource);

        const channel = serverQueue.connection.joinConfig.channelId 
            ? client.channels.cache.get(serverQueue.connection.joinConfig.channelId) 
            : null;

        if (channel) {
            channel.send(`🎵 **Reproduciendo ahora:** ${song.title}`);
        }

        serverQueue.player.once(AudioPlayerStatus.Idle, () => {
            serverQueue.songs.shift();
            if (serverQueue.songs.length > 0) {
                playSong(guildId, client);
            } else {
                serverQueue.connection.destroy();
                client.queue.delete(guildId);
            }
        });

    } catch (err) {
        console.error(err);
        serverQueue.songs.shift();
        if (serverQueue.songs.length > 0) playSong(guildId, client);
    }
}
