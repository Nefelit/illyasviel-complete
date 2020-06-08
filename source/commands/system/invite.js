module.exports = {
    name: 'invite',
    description: "<a href='https://aspire.su/invite' class='cool'>Поделитесь нашим ботом с друзьями, или пригласите его сами!</a>",
    execute: async function (message, args) {
        let embed = new Discord.MessageEmbed()
            .setDescription(`[Нажмите на данный текст для приглашения.](https://aspire.su/invite)`)
        message.channel.send(embed)
    }
}