module.exports = {
    name: 'replay',
    aliases: ['re', 'reset'],
    description: "Начнет проигрывание текущей песни с начала",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play); let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        client.player.getPlayer(message.guild.id).seekTo(0.1)
        message.channel.send(`⏮️ **Перематываю к началу**`)
    }
}