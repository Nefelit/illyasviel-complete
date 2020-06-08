module.exports = {
    name: 'pause',
    aliases: ['stopbutdontleave'],
    description: "Ставит воиспроизведение на паузу",
    execute: async function (message, args, locale, sys) {
        if (!locale) locale = Translate.get('ru', this.name)
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        let player = client.player.getPlayer(message.guild.id);
        player.setPaused(true);
        message.channel.send(locale.paused)
    }
}