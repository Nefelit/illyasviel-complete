let parse = require('parse-duration');
module.exports = {
    name: 'seek',
    aliases: ['goto', 'go', 'to', 'forward'],
    description: "Перемещает воиспоизведение на заданное время, <b>ставит, а не добавляет</b>.<br><code>i!seek 1m</code> - перемещает проигрыватель к 1 минуте трека",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play); let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;

        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        if (!args[0]) return message.channel.send(`Соблюдайте синтаксис.\n\`${message.guild.data.prefix}seek 1m\` или же \`${message.guild.data.prefix}forward 1m 15s\`\nВ примере используются алиасы которые ссылаются на основную команду.`)
        let seekTime = parse(args.join(" "));
        client.player.getPlayer(message.guild.id).seekTo(seekTime <= 0 ? 0.1 : seekTime);
        message.channel.send(`⏭️ **Перематываю в указанную точку**`)
    }
}