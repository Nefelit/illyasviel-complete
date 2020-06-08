module.exports = {
    name: "playlist",
    description: `Управление созданым плейлистом<br><code>i!playlist <лист> add <запрос></code> - Добавит в ваш плейлист трек по вашему запросу
<br><code>i!playlist <лист> remove <номер></code> - Удалит трек с определенным номером с вашего листа
<br><code>i!playlist <лист> play</code> - Добавит треки в очередь с вашего плейлиста.
<br><code>i!playlist <лист> delete</code> - Удаляет ваш плейлист, но спросит потверждения.
<br>
<br><code>i!playlist aspire add Nightcall - Hymn</code> - Добавит в плейлист Aspire трек <a href="https://www.youtube.com/watch?v=TI9VGIrSHpU">Nightcall - Hymn</a>`,
    execute: async function (message, args, locale) {
//	return message.channel.send("Управление плейлистами временно недоступно [**обслуживание**]\nЗапускать плейлист по прежнему можно командой `pp`");
        let [list] = await con.query(`SELECT * FROM Playlist WHERE owner = ?`, [message.author.id])
        if (!list[0]) return message.channel.send(locale.no_list)

        let name = args[0];
        let pname = name ? name : 'name'
        let block = `\`\`\`fix
${message.guild.data.prefix}create [${pname}] - создать плейлист
${message.guild.data.prefix}playlist ${pname} add [track] - ${locale.add_help}
${message.guild.data.prefix}playlist ${pname} remove [index] - ${locale.remove_help}
${message.guild.data.prefix}playlist ${pname} delete - ${locale.delete_help}
\`\`\``
        if (!name) return message.channel.send(block)
        if (!list.map(x => x.name).some(x => x === name)) return message.channel.send(locale.cant_manage);
        let index = list[list.map(x => x.name).indexOf(name)].id;
        let [songs] = await con.query(`SELECT songs FROM Playlist WHERE name = ?`, [name]);
        songs = list[0].songs
        songs = songs.length === 0 ? [] : songs;
        args.shift()
        let action = args[0];
        if (!action) return message.channel.send(block)

        if (action === 'add') {
            args.shift();

            let track = await client.player.resolveSong(args);
            if (!track.tracks[0]) return message.channel.send(locale.bad_search);
            if (track.playlistInfo.name) {
                let wait = await message.channel.send(locale.loading.parse({ track: track.playlistInfo.name }))
                let compare = songs;
                track.tracks.forEach(track => compare.push(track));
                con.query(`UPDATE Playlist SET songs = JSON_SET(songs, '$.songs', ?) WHERE id = ?`, [JSON.stringify(compare), index])
                return wait.edit(`<:folder:682557056120782890> Плейлист **${track.playlistInfo.name}** загружен, добавлено **${track.tracks.length}** треков!`);
            }
            message.channel.send(locale.loaded.parse({ title: track.tracks[0].info.title }))
            let compare = songs;
            compare.push(track.tracks[0]);
            await con.query(`UPDATE Playlist SET songs = JSON_SET(songs, '$.songs', ?) WHERE id = ?`, [JSON.stringify(compare), index])
        } else if (args[0] === 'remove') {
            args.shift();
            let index = args[0];
            if (!index || index > songs.length || index < 0) return message.channel.send(locale.no_index.parse({
                prefix: message.guild.data.prefix
            }));
            let tmp = songs[index];
            if (tmp) {
                message.channel.send(locale.removed.parse({
                    track: tmp.info.title
                }));
            } else {
                message.channel.send(locale.fetch_error)
            };
            let compare = songs.slice(0, index).concat(songs.slice(index + 1));
            await con.query(`UPDATE Playlist SET songs = JSON_SET(songs, '$.songs', ?) WHERE name = ?`, [JSON.stringify(compare), name]).then(console.log)

        } else if (args[0] === 'play') {
            client.commands.get('pp').execute(message, [name], Translate.get('ru', 'pp'))
        } else if (args[0] === 'delete') {
            args.shift();
            let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id);
            message.channel.send(locale.begin_delete.parse({
                name,
                size: songs.length
            }));
            collector.on('collect', async msg => {
                if (msg.content === 'confirm') {
                    message.channel.send(locale.deleted);
                    await con.query(`DELETE FROM Playlist WHERE name = ?`, [name]);
                    collector.stop();
                } else {
                    message.channel.send(locale.canceled);
                    collector.stop();
                }
            })
        }


    }
}
