module.exports = {
    name: 'bandcamp',
    description: 'Ищет ваш запрос на <b>bandcamp.com</b>',
    aliases: ['bc'],
    execute: async function (message, args, locale, sys) {
        if (!ISVOICE(message)) return;
        client.commands.get('play').execute(message, ['bc', ...args], Translate.get(message.guild.data.language, 'play'), sys)
    }
}