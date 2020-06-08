const snekfetch = require("snekfetch");
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'np',
    aliases: ['nowplaying', 'nowplay', 'now'],
    description: "Показывает информацию о текущем треке (информация плеера)<br><br><code>--q</code> - показывает следующие 15 треков<br><code>--display</code> - скроет кнопки под плеером",
    execute: async function (message, args, locale, sys) {
        if (!locale) locale = Translate.get('ru', this.name)
        if (!client.player.getPlayer(message.guild.id)) return message?.channel?.send(sys.none_play);
        if ((client.player.getPlayer(message.guild.id) && client.player.getPlayer(message.guild.id).track) && !client.player.queue.get(message.guild.id)) return message.channel.send(`Команда заблокирована на сервере: **Сейчас запущена викторина**`);
        let { nextSongs, currentSong, player, guild, time } = client.player.nowPlayingRaw(message.guild.id);

        currentSong = client.player.prepareSong(currentSong);

        if (message._flags.has('old') && (!client.player.getPlayer(message.guild.id) || !client.player.queue.get(message.guild.id).songs.length)) return;

        let np = client.player.queue.get(message.guild.id);
        if (!currentSong) return message.channel.send(locale.error_message_system)
        if (!message._flags.has('old') && (np && np.bound && np.message)) {

            client.channels.cache.get(np.bound).messages.fetch(np.message).then(m => m.delete())
        }
        const queue = (num) => {
            let queue = nextSongs;
            let queueText = '';
            for (let i = num; i < (num + 5); i++) {
                if (queue[i]) {
                    let Song = queue[i].info;
                    let title = Song.title.slice(0, 20) + '...';
                    queueText += `[${title}](${Song.uri})\n`;
                } else queueText += `- - - - -\n`;
            };
            return queueText;
        }
        let bar = '';
        let bar2 = '';
        let rows = 22;
        if (message.author && message.author.presence.clientStatus && message.author.presence.clientStatus.mobile) rows = rows - 4;
        let currentRow = player.position / currentSong.info.length * rows;
        bar += '<:start:688637998039826440>';
        bar2 += '[▬'
        for (i = 0; i < rows; i++) {
            if (i === (currentRow | 0)) {
                bar += '<:now:688636578675163148>';
                bar2 += `▬](https://aspire.su/ \'${(player.position / currentSong.info.length * 100).toFixed(2)}%\')`;

            } else {
                bar += '<:fill:688636061500702816>';
                bar2 += '▬'
            }
        }
        bar += '<:end:688637385986408449>';
        if (!currentSong.info.requestBy) currentSong.info.requestBy = '678121374887444480'
        let embed = new Discord.MessageEmbed()
            .setColor('#18191c')
            .setAuthor(`Now playing queue for ${guild.name}`, guild.iconURL() ? guild.iconURL() : null, currentSong.info.uri)
            .setDescription(`${locale.now} **[${currentSong.info.title}](${currentSong.info.uri})**\n${locale.by}: ${currentSong.info.requestBy ? client.users.cache.get(currentSong.info.requestBy) : 'UNNAMED'} ${!currentSong.info.isStream ? `\n\n${locale.volume}: ${player.volume}%\n\`[${moment.duration(player.position, "ms").format("hh:mm:ss", { trim: false })} / ${moment.duration(currentSong.info.length, "ms").format("hh:mm:ss", { trim: false })}] • [${moment.duration(player.position, "ms").format("hh:mm:ss", { trim: false })} / ${moment.duration(time, "ms").format("hh:mm:ss", { trim: false })}]\`\n${bar2}` : '\n\n🎵 Играет радиостанция, пропустить может только автор и/или администратор!'}`)
        if (message._flags.has('q')) {
            embed
                .addField('** **', queue(0), true)
                .addField('** **', queue(5), true)
                .addField('** **', queue(10), true)
        }
        if (message._flags.has('i') || message._flags.has('image') || currentSong.info.isStream) {
            embed.setImage(currentSong.info.thumbnail && currentSong.info.thumbnail[0] || currentSong.info.thumbnail && currentSong.info.thumbnail[1] || 'https://repository-images.githubusercontent.com/237238102/44c72700-4456-11ea-81d8-edb4970e4973')
        }
        embed.setFooter(nextSongs.length > 0 ? `••• ${nextSongs.length
            } ${locale.length} ` : `••• ${locale.last} `)
        let msg;
        if (!message._flags.has('old')) {
            let last = 0;

            let sections;
            if (false && currentSong.info.sections[0]) {
                let i = 0;
                sections = new MessageEmbed()
                    .setColor('INVISIBLE')
                    .setTitle(`YouTube Episodes`)
                    .setDescription(`Ютуб поддерживает эпизоды в видео, что позволяет разделять видео на секции и перемещаться по ним.\n\n\`[${moment.duration(player.position, "ms").format("mm:ss", { trim: false })}]\` - **Мы сейчас тут**\n\n${currentSong.info.sections.map((x) => {
                        return `\`[${++i}] ${i<10? ` ` : ''}[${x[0][0]}]\` - **${x[1]}**`
                    }).join("\n")}`)
                if (message._flags.has('sections') && currentSong.info.sections[0]) return message.channel.send(sections)
            }
            msg = await message.channel.send(embed)
            client.player.queue.set(message.guild.id, msg.channel.id, 'bound')
            client.player.queue.set(message.guild.id, msg.id, 'message');
            message = {
                author: message.author,
                guild: message.guild,
                _flags: new Set(['old', 'display'])
            }
            if (!currentSong.info.isStream && message._flags.has('update')) setTimeout(() => this.execute(message, [], Translate.get('ru', 'np'), sys), 5000)
        } else {
            let channel = client.channels.cache.get(client.player.queue?.get(message.guild.id)?.bound);
            let m = await channel.messages.fetch(client.player.queue?.get(message.guild.id)?.message);
            if (m) m.edit(embed)
            if (!currentSong.info.isStream && message._flags.has('update')) setTimeout(() => this.execute(message, ['--old', '--display'], Translate.get('ru', 'np'), sys), 5000)
        }
        if (!message._flags.has('old') || !currentSong.info.isStream) {
            let used = new Set();
            await msg.react('682557056120782890');
            await msg.react('📰');
            await msg.react('🔂');
            await msg.react('⏮️');
            await msg.react('⏯️');
            await msg.react('⏭️');
            await msg.react('🇽');

            let filter = (__reaction, user) => user.id === message.author.id;
            let collector = msg.createReactionCollector(filter, { time: 30000 })
            collector.on('collect', async r => {
                r = r.emoji.id || r.emoji.name;


                collector.resetTimer();
                if (r === '682557056120782890') {
                    message.channel.send(`** ${message.guild.data.prefix} playlist \`name\` add <${client.player.queue.get(message.guild.id).songs[0].info.uri}>**`)
                } else if (r === '📰') {
                    if (used.has('lyrics')) return;
                    used.add('lyrics')
                    await client.commands.get('lyrics').execute(message, [], Translate.get(message.guild.data.language, 'lyrics'), sys);
                    setTimeout(() => {
                        used.delete('lyrics');
                    }, 15000)
                } else if (r === '🔂') {
                    await client.commands.get('loop').execute(message, [message.guild.data.looping > 0 ? 'single' : 'disable'], Translate.get(message.guild.data.language, 'loop'), sys);
                } else if (r === '⏮️') {
                    await client.commands.get('replay').execute(message, [], Translate.get(message.guild.data.language, 'replay'), sys);
                } else if (r === '⏯️') {
                    let paused = client.player.getPlayer(message.guild.id).paused;
                    if (paused) return await client.commands.get('resume').execute(message, [], Translate.get(message.guild.data.language, 'resume'), sys);
                    return await client.commands.get('pause').execute(message, [], Translate.get(message.guild.data.language, 'pause'), sys);
                } else if (r === '⏭️') {
                    await client.commands.get('skip').execute(message, [], Translate.get(message.guild.data.language, 'skip'), sys);
                } else if (r === '🇽') {
                    collector.stop();
                    msg.delete();
                }
            });
        }

    }
}
