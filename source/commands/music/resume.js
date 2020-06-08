module.exports = {
    name: 'resume',
    aliases: ['r'],
    description: "Снимает плеер с паузы, или пытается починить битый трек.",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play); let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!client.player.getPlayer(message.guild.id).track && client.player.nowPlayingRaw(message.guild.id).currentSong) {
            client.player.playSong(message, client.player.nowPlayingRaw(message.guild.id).currentSong)
            return
        };

        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        if (!client.player.queue.get(message.guild.id) || !client.player.queue.get(message.guild.id).songs) {

            client.player.getPlayer.delete(message.guild.id)
            client.player.queue.delete(message.guild.id)
            return;
        }
        let player = client.player.getPlayer(message.guild.id);
        player.setPaused(false);
        message.channel.send(`⏯️ **Плеер снят с паузы**`)
    }
}