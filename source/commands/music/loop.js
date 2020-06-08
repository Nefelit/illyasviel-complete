module.exports = {
    name: 'loop',
    aliases: ['repeat', 'loop'],
    description: "Режим повтора, может принимать значение<br><code>single</code> - Повторять один трек<br><code>queue</code> - Повторять список песен<br><code>disable</code> -Убрать повторение",
    execute: async function (message, args, locale) {
        if (!ISVOICE(message)) return;
        let select = args[0];
        let type = 0;
        if (select === 'single') {
            message.channel.send(locale.single)
            type = 2;
        } else if (select === 'queue' || select === 'all') {
            message.channel.send(locale.queue)
            type = 1;
        } else if (select === 'disable' || select === 'off') {
            message.channel.send(locale.off)
            type = 0;
        } else return message.channel.send(`\`\`\`markdown
# ${locale.description}
> ${message.guild.data.prefix}loop [ single | queue | off ]\`\`\``);
        message.guild.data.looping = type;
        con.query(`UPDATE Guilds SET looping = ? WHERE id = ?`, [type, message.guild.id])
    }
}