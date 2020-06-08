module.exports = {
    name: 'search',
    description: "Идентично команде <code>play</code>, только в данном случае вы можете уточнить, какой трек выбрать<br><code>--unshift</code> - Снимает ограничение на количество треков в поиске",
    execute: async function (message, args) {
        if (!ISVOICE(message)) return;
        message.delete();
        let track = await client.player.resolveSong(args),
            tracks;
        if (!track.tracks[0]) return message.channel.send(`Увы, мы ничего не смогли найти по данному запросу`);
        if (!message._flags.has('unshift')) {
            tracks = track.tracks.slice(0, 10);
        } else {
            tracks = track.tracks
        }
        let text = tracks.map((x, i) => `\`[${i}]\` ${x.info.title} - ${moment.duration(x.info.length, "ms").format("hh:mm:ss", { trim: false })}`).join('\n');

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Поиск по запросу "${args.join(" ")}"`, client.user.displayAvatarURL())
            .setDescription(text)
            .setFooter(message._flags.has('unshift') ? `••• Найдено ${tracks.length} треков, ожидание.` : `••• Сжато до 10 песен, добавьте --unshift если хотите больше`);
        message.channel.send(embed).then(msg => {
            const filter = m => !isNaN(m.content) && m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector(filter, { time: 30000 });
            collector.on('collect', r => {
                if (isNaN(r.content)) return;
                r.delete()
                r = parseInt(r.content);
                if (r < 0 || r > tracks.length) return;
                let selected = tracks[r];
                selected.info.requestBy = message.author.id;
                collector.stop();
                message.channel.send(`Выбран трек **${selected.info.title}**, добавлен в лист ожидания!`)
                client.player.addSong(message.guild.id, selected, message);
                let queue = client.player.queue.get(message.guild.id).songs
                if (!client.player.getPlayer(message.guild.id)) client.player.playSong(message, queue[0]);
            });
            collector.on('end', r => {
                msg.delete();
            })
        })
    }
}