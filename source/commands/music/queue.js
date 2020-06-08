module.exports = {
    name: 'queue',
    aliases: ['q', 'ls'],
    description: "Показывает очередь песен<br><code>i!queue 3</code> показывает очередь на 3-ей странице",
    execute: async function (message, args, locale, sys) {
        // if (!ISVOICE(message)) return;
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        if (client.player.queue.get(message.guild.id).songs.length <= 1) return message.channel.send(sys.last);
        let page = args[0] ? args[0] : 1;
        if (isNaN(page) || page <= 0 || page > 300) page = 1;
        let embed = client.player.displayQueue(message.guild.id, page);
        message.channel.send({ embed })

    }
}