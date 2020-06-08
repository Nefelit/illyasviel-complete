module.exports = {
    name: 'nightcore',
    description: 'Накладывает на звуковую дорожку эффект <b>nightcore</b>, ускоряя ее в 1.5 раза',
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
        } else if (args[0] === 'enable') {
            band = 1.5
        } else if (args[0] === '3x') {
            band = 3
        } else if (args[0] === 'slow') {
            band = 0.7
        } else {
            message.channel.send(`
\`\`\`markdown
# ${locale.description}
> i!nightcore [disable, enable, 3x, slow]
\`\`\`
        `)
            return;
        }
        message.channel.send(sys.wait_for_effect)
        client.player.getNode().send({
            op: 'filters',
            timescale: { rate: band },
            guildId: message.guild.id
        });
    }
}