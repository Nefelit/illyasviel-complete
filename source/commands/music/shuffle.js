module.exports = {
    name: 'shuffle',
    aliases: ['randomize'],
    description: "Перемешивает очередь треков, иногда может надоесть слушать один и тот же плейлист по порядку.",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        client.player.shuffle(message.guild.id);
        message.channel.send(`🔀 Перемешано **${client.player.queue.get(message.guild.id).songs.length}** песен!`)
    }
}