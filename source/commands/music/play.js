let providers = {
    'soundcloud': "<:soundcloud:707690273144176741> ",
    'youtube': "",
    'bandcamp': "",
    'http': "⚠️ "
}

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: "Ищет ваш запрос, и добавляет его в очередь<br><code>i!play sc <запрос></code> - ищет ваш запрос на <b>sound cloud</b><br><code>i!play bc <запрос></code> - ищет ваш запрос на <b>band camp</b><br><br><code>--all</code> - добавит в лист все найденные варианты",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        let startPlay = () => {
            let queue = client.player.queue.get(message.guild.id).songs
            if ((client.player.getPlayer(message.guild.id) && !client.player.getPlayer(message.guild.id).track) || !client.player.getPlayer(message.guild.id)) {
                client.player.playSong(message, queue[0], { selfdeaf: true, startTime: +queue[0]?.info?.start * 1000 || 0 })
            }
        }
        // if (args[0] === 'sc') return message.channel.send(`Приносим свои извинения, на текущий момент мы заблокированы данным сервисом, и ищем решение.`);
        if (args[0] && (args[0] === 'last' || args[0].startsWith('recent'))) {
            let [last] = await con.query(`SELECT * FROM Analytics WHERE author = ? ORDER BY createdAt DESC LIMIT 1`, [message.author.id]);
            if (last[0]) {
                args = [last[0].title]
            }
        }
        let track = await client.player.resolveSong(args);
        if (track.class) {
            message.channel.send(`\`${track.message}\n${track.class}\``)
        }
        if (!track.tracks[0]) return message.channel.send(locale.bad_search);

        if (client.player.queue.get(message.guild.id)) client.player.queue.set(message.guild.id, null, 'timeout')

        try {
            if (track.playlistInfo.name && !track.playlistInfo.name.startsWith('Search results for') || message._flags.has('all')) {
                let wait = await message.channel.send(locale.loading.parse({
                    track: track.playlistInfo.name || `все вариации запроса`
                }))
                for (let _track in track.tracks) {
                    if (isNaN(_track)) continue;
                    track.tracks[_track].info.isPlaylist = true;
                    track.tracks[_track].info.requestBy = message.author.id;
                }
                client.player.addSong(message.guild.id, track.tracks, message);
                startPlay();
                return wait.edit(locale.loaded_list.parse({
                    name: track.playlistInfo.name || `все вариации запроса`,
                    sized: track.tracks.length
                }));
            }
        } catch (error) {
            console.log(error)
            message.channel.send(`Активировалась заглушка. \nК сожалению, библиотека с которой мы работаем - иногда может выдавать ошибку.`)
        }
        message.channel.send(`${track.start ? `Найдена временная отметка, трек начнется с нее **\`${track.start}сек\`**\n` : ''}${providers[track.provider]}${locale.loaded.parse({ title: track?.tracks[0]?.info?.title || 'PLAYLIST NAME IS BROKEN' })}${client.player.queue.get(message.guild.id) && client.player.queue.get(message.guild.id).songs && client.player.queue.get(message.guild.id).songs.length ? ` ${locale.to} ${client.player.queue.get(message.guild.id).songs.length} ${locale.position}!` : '!'}`)

        track.tracks[0].info.requestBy = message.author.id;
        track.tracks[0].info.start = track.start;
        client.player.addSong(message.guild.id, track.tracks[0], message);
        startPlay();
    }
}
