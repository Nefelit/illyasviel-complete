module.exports = {
    name: 'karaoke',
    description: 'Накладывает на звуковую дорожку эффект <b>караоке</b>',
    execute: async function (message, args, locale, sys) {
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        let selected = args[0];
        let band;
        if (args[0] === 'disable') {
            band = 1
            type = 'level'
        } else if (args[0] === 'enable') {
            band = 1.5
        } else if (args[0] === 'deep') {
            band = 0.5
        } else if (args[0] === 'mono') {
            return message.channel.send(`Тех обслуживание функции mono.`);
            band = 0.5
            type = 'band'
        } else {
            message.channel.send(`
\`\`\`markdown
# ${locale.description}
> i!karaoke [disable, enable, deep, mono]
\`\`\`
        `)
            return;
        }
        message.channel.send(sys.wait_for_effect)
        client.player.getNode().send({
            op: 'filters',
            karaoke: { level: band },
            guildId: message.guild.id
        });
    }
}