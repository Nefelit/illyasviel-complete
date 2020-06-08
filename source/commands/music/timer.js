let parse = require('parse-duration')
module.exports = {
    name: "timer",
    description: "Думаете, что уснете? Или может хотите поставить паузу через определенное время?<br><code>i!timer 3m 30s</code> - Через 3 минуты и 30 секунд, запустит команду pause от <b>вашего аккаунта</b>.",
    execute: async function (message, args, locale) {
        let mode = args.join(" ");
        if (!args[0]) return message.channel.send(`\`\`\`markdown
# ${locale.timer}
> ${message.guild.data.prefix}timer [1m | 5m | 30m | 1h ...]
\`\`\``)
        let timer = setTimeout(() => {
            if (client.player.getPlayer(message.guild.id)) {
                client.commands.get('pause').execute(message, []);
                client.guildConfig.delete(message.guild.id, 'timer');
            } else {
                client.guildConfig.delete(message.guild.id, 'timer');
            }
        }, parse(mode));
        message.channel.send(locale.set)
        client.guildConfig.set(message.guild.id, timer, 'timer')

    }
}