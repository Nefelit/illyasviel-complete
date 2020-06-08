module.exports = {
    name: 'soundcloud',
    aliases: ['sc'],
    description: "Ищет ваш запрос на <b>sound cloud</b>",
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        locale = Translate.get('ru', 'play')
        client.commands.get('play').execute(message, ['sc', ...args], locale, sys)
    }
}