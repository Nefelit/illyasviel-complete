module.exports = {
    name: "pp",
    description: "Запускает ваш плейлист по названию<br><code>i!pp aspire</code> запустит плейлист aspire<br><b>Обратите внимание, данная команда идентичная <code>i!playlist aspire play</code>",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        const playlist = args[0];
        if (!playlist) return message.channel.send(locale.no_query);
        let [list] = await con.query(`SELECT * FROM Playlist WHERE name = ?`, [playlist]);
        if (!list[0]) return message.channel.send(locale.no_list);
        if (list[0].hidden && list[0].owner !== message.author.id) return message.channel.send(locale.hidden);
        let songs = list[0].songs;
        if(!songs) return message.channel.send(locale.broken);
        let startPlay = () => {
            let queue = client.player.queue.get(message.guild.id).songs
            if (!client.player.getPlayer(message.guild.id)) client.player.playSong(message, queue[0])
        }
        let wait = await message.channel.send(locale.loading.parse({ name: list[0].name }))
        songs.forEach(song => {
            song.info.isPlaylist = true;
            song.info.requestBy = message.author.id;
        })
        client.player.addSong(message.guild.id, songs, message);
        startPlay();
        return wait.edit(locale.loaded.parse({
            name: list[0].name,
            sized: songs.length
        }));
    }
}