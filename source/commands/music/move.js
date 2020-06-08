module.exports = {
    name: 'move',
    aliases: ['m', 'mv', 'replace'],
    description: "Перемещает треки местами, например<br><code>i!move 5 0</code> - перенесет 5 трек на нулевую позицию, и он будет следующим на очередь.",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        let queue = client.player.queue.get(message.guild.id);
        let move = {
            from: parseInt(args[0]),
            to: parseInt(args[1]) + 1
        };
        for (let item in move) {
            if (!move[item] || isNaN(move[item])) return message.channel.send(locale.no_argument.parse({ item }));
            if (move.from < 0 || move.to > queue.songs.length) return message.channel.send(locale.no_index);
        };
        let temporary = {
            from: queue.songs[move.from],
            to: queue.songs[move.to]
        };

        if ((temporary.from.info.requestBy !== message.author.id || temporary.to.info.requestBy !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(locale.error);
        client.player.queue.set(message.guild.id, temporary.from, `songs[${move.to}]`)
        client.player.queue.set(message.guild.id, temporary.to, `songs[${move.from}]`)
        message.channel.send(locale.move.parse({
            from: temporary.from.info.title,
            to: temporary.to.info.title
        }))
    }
}