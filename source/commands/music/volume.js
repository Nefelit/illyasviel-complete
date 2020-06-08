module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: "Меняет звук плеера на определенный.<br><code>i!volume 50</code><br><br><code>--safe</code> - смещает лимит с 100 на 350, не злоупотребляйте, пожалуйста.",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(`🔇 **Ничего не играет!**`);

        if (!args[0]) {
            let volume = client.player.getPlayer(message.guild.id).volume;
            message.channel.send(`${volume < 50 ? '🔉' : '🔊'} Уровень звука: **${volume}%**`)
            return;
        }
        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        let volume = parseInt(args[0]);
        if (isNaN(volume)) return message.channel.send(`🔇 Вы не указали новое значение для параметра звука!`);
        if (volume > 100 && !message._flags.has('safe')) return message.channel.send(`Нельзя ставить большой звук, это нагружает бота, не вы одни слушаете музыку!`);
        if (volume > 350) return message.channel.send(`Нельзя ставить большой звук, это нагружает бота, не вы одни слушаете музыку!`);
        client.player.getPlayer(message.guild.id).setVolume(volume);
        if (volume < 0) return message.channel.send(`🔇 Звук ушел в отрицательное значение, но плеер все еще играет!`);
        message.channel.send(`${volume < 50 ? '🔉' : '🔊'} Новое значение звука **${volume}%**`)
    }
}
