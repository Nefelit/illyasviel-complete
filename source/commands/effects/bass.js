module.exports = {
    name: 'bass',
    description: 'Накладывает на звуковую дорожку эффект <b>басс бустед</b>',
    aliases: ['boost', 'bassbost', 'equalizer'],
    execute: async function (message, args, locale, sys) {
        if (!client.player.getPlayer(message.guild.id)) return message.channel.send(sys.none_play);
        let authorID = client.player.queue.get(message.guild.id).songs[0].info.requestBy;
        if (!(config.owners.includes(message.author.id) && message._flags.has('dev')) && ((authorID !== message.author.id) && !message.member.permissions.has('MANAGE_GUILD'))) return message.channel.send(sys.other.parse({
            tag: client.users.cache.get(authorID).tag
        }));
        let selected = args[0];
        let band;
        if (args[0] === 'disable') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.00 }));
        } else if (args[0] === 'minimum') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.05 }));
        } else if (args[0] === 'pre-medium') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.15 }));
        } else if (args[0] === 'medium') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.25 }));
        } else if (args[0] === 'maximum') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.35 }));
        } else if (args[0] === 'maximum-full') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.55 }));
        } else if (args[0] === 'full') {
            band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 1 }));
        } else {
            message.channel.send(`
\`\`\`markdown
# ${locale.description}
> i!bass [disable, minimum, pre-medium, medium, maximum, maximum-full, full]
\`\`\`
        `)
            return;
        }
        message.channel.send(sys.wait_for_effect)
        let player = client.player.getPlayer(message.guild.id);
        player.setEqualizer(band)
    }
}