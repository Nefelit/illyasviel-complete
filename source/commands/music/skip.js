module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: "Пропускает текущий трек, и запускает следующий.",
    execute: async function (message, args, locale, sys) {
        if (!locale) locale = Translate.get('ru', this.name)
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        if (!client.player.queue.get(message.guild.id) || !client.player.queue.get(message.guild.id).songs) {

            client.player.getPlayer.delete(message.guild.id)
            client.player.queue.delete(message.guild.id)
            return;
        }

        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: authorID ? client.users.cache.get(authorID) : 'UNNAMED STREAM'
        }));
        client.player.getPlayer(message.guild.id).stopTrack();
        message.channel.send(`⏩ **Трек пропущен!**`);
    }
}