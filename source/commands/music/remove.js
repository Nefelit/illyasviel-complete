module.exports = {
    name: 'remove',
    aliases: ['rm', 'delete'],
    description: "Убирает трек с списка ожидания<br><code>i!remove 3</code> - удалит трек с номером <b>3</b> из очереди",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play); let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        /*  if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
                tag: client.users.cache.get(authorID).tag
            }));*/
        if (client.player.queue.get(message.guild.id).songs.length <= 1) return message.channel.send(`ℹ️ **Играет последний трек, команда прервана.**`);
        let index = args.join(" ");
        let songs = client.player.queue.get(message.guild.id).songs;
        
        index = index.replace(/\s*to\s*/g, '-');

        if ((!isNaN(index.split('-')[1]) && !isNaN(index.split('-')[0]))) {

            let diff = Math.abs(index.split('-')[1] - index.split('-')[0]);
            if (diff > client.player.nowPlayingRaw(message.guild.id).nextSongs.length) return message.channel.send(`Нет столько треков, чтоб удалять их!`);
            if (diff < 1) return message.channel.send('Слишком мало треков :p');
           
            let tmp = client.player.queue.get(message.guild.id, `songs[${+index.split('-')[0] + 1}]`);
            let
                first = index.split('-')[0],
                second = index.split('-')[1];
            for (let i = first; i < second; i++) {
                let track = client.player.queue.get(message.guild.id, `songs[${i}]`);
                console.log(track.info.title, i)
                client.player.queue.delete(message.guild.id, `songs[${i}]`);
            };
            message.channel.send(`Трек **${tmp.info.title}** и еще ${diff} треков были удалены из очереди.`);
        } else {
            if (!index || index > songs.length || index < 0) return message.channel.send(`Индекс выходит за границы, либо не указан. Посмотрите номер удаляемого трека в \`${message.guild.data.prefix}queue\``);
            index++;
            let tmp = client.player.queue.get(message.guild.id, `songs[${index}]`);
            if ((tmp.info.requestBy !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(`Данный трек заказали не вы, так нельзя :(`)
            client.player.queue.delete(message.guild.id, `songs[${index}]`);
            message.channel.send(`Трек **${tmp.info.title}** был удален из очереди.`);
        }

    }
}