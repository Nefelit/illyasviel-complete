const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "stats",
    aliases: ['about'],
    description: 'Совсем ненужная вам команда, показывает статистику бота.',
    execute: async function (message, args, locale) {
        moment.locale('ru');
        let memory = +(process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        //message.channel.send(`${locale.started_at} **${moment(Date.now() - client.uptime * 3).fromNow()}**\n${locale.memory_usage}: **${memory}MB**\nLavalink ${locale.memory_usage}: **${memoryTotal}MB**\nTotal ${locale.memory_usage}: **${total > 1024 ? `${(total / 1024).toFixed(2)}GB` : `${total}MB`}**\n\n${locale.guilds}: ${client.guilds.cache.size}`)
        let embed = new MessageEmbed()
            .setAuthor(`Analitic of ${client.user.username}`, client.user.displayAvatarURL(), 'https://aspire.su')
            .setDescription(`Запущена ${moment(Date.now() - client.uptime).fromNow()}, **${memory}/250MB** памяти используется, обслуживаю **${client.guilds.cache.size}** серверов и **${client.guilds.cache.reduce((s, g)=>s+g.memberCount, false)}** пользователей.\n\nИмеется **${client.trivia.videos.length}** опенингов для викторин и трансформации в музыку!\n**Плееры синхронизированны с Chomusuke**`);
        let i = 0; // 5 *, убрать
        client.player.nodes.forEach((node) => {
            embed.addField(`Music NODE#${++i}`, `Играет: ${node.stats.playingPlayers}\nПлееров: ${node.stats.players}\n**Запущена ${moment(Date.now() - node.stats.uptime).fromNow()}, кушает ${(node.stats.memory.used / 1024 / 1024).toFixed(2)}MB**`, true)
        })
        embed.setFooter(`Developed with ❤️ by ${client.users.cache.get('533681290856103966').tag}`, client.users.cache.get('533681290856103966').displayAvatarURL())
        message.channel.send(embed)
    }
}
