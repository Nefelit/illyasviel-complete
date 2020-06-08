module.exports = {
    name: 'stop',
    aliases: ['leave', 'end', 'clear'],
    description: "Останавливает произведение, и очищает список песен => <b>покидает канал</b>.",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        if (!client.player.queue.get(message.guild.id) && client.player.getPlayer(message.guild.id)) {
            client.player.queue.delete(message.guild.id);
            client.player.getPlayer(message.guild.id).destroy();
            client.player.getPlayer(message.guild.id).stop();
            message.channel.send(`⏹️ **Покидаю канал!**`);
            return;
        }
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(`🔇 **Ничего не играет!**`);
        if (!client.player.queue.get(message.guild.id) || !client.player.queue.get(message.guild.id).songs) {

            client.player.getPlayer.delete(message.guild.id)
            client.player.queue.delete(message.guild.id)
            return;
        }
        let authorID = client.player.queue.get(message.guild.id)?.songs[0]?.info?.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: authorID ? client.users.cache.get(authorID) : 'СТРИМ ЗАКАЗ'
        }));
        client.player.queue.delete(message.guild.id);
        client.player.getPlayer(message.guild.id).disconnect();
        message.channel.send(`⏹️ **Покидаю канал!**`);
    }
}