module.exports = {
    name: "profile",
    aliases: ['my', 'list', 'mylist'],
    description: "Показывает ваш список плейлистов",
    execute: async function (message, args, locale) {
        require('moment').locale('ru')
        let [list] = await con.query(`SELECT * FROM Playlist WHERE owner = ?`, [message.author.id]);
        if (!list[0]) return message.channel.send(locale.no_list);
        let pages = new client.pages(message.author.id);
        list.forEach((playlist, index) => {
            let embed = new Discord.MessageEmbed()
                .setColor('INVISIBLE')
                .setTitle(`Плейлист ${playlist.name}`)
                .setDescription(`${locale.name}: \`${playlist.name}\`, ${locale.createdAt} ${moment(playlist.createdAt).tz('Europe/Moscow').fromNow()}\n${locale.sized}: \`${playlist.songs.length === 0 ? '0' : playlist.songs.length}\`\n${locale.hidden}: \`${playlist.hidden ? 'true' : 'false'}\`\n${locale.owner}: \`${playlist.owner}\`\n${locale.position}: \`${playlist.id}\``)
            pages.add(embed)
        });
        pages.send(message.channel)
    }
}