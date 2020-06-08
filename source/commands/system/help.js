module.exports = {
        name: "help",
        description: "Эм.... :)",
        execute: async function (message, args, locale) {
                let commands = client.commands.filter(x => x.module !== 'dev');
                let msg = 'Ознакомиться со списком команд можно тут, мы не стали отсылать сообщение, так как гораздо понятнее будет проверить сайт.\nhttps://aspire.su/commands';
                //msg += `Предпросмотр команд будет изменен в будущем.\nПригласить бота и перейти к панели настройки: <https://aspire.su/g>\n\n`;
                //msg += `**Музыка**\n${commands.filter(x => x.module === 'music').map(x => `\`${x.name}\``).join(" ")}\n`;
                //msg += `**Прочее**\n${commands.filter(x => x.module === 'other').map(x => `\`${x.name}\``).join(" ")}\n`;
                //msg += `**Управление пользовательскими плейлистами**\n${commands.filter(x => x.module === 'social').map(x => `\`${x.name}\``).join(" ")}\n`;
                //msg += `**Команда playlist содержит команды-аргументы**\n\`add\`, \`remove\`, \`delete\``
                //msg += `\n\nПрисоединяйтесь к нашему комьюнити, помощь и идеи включительно: https://discord.gg/dVRCMxh`
                message.channel.send(msg);
        }
}
