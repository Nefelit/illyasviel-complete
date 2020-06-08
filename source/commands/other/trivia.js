
let block = new Set();
let points = {};
let Discod = require('discord.js')

module.exports = {
    name: 'trivia',
    description: 'Когда нибудь, отгадывали опененги в ивентах или на youtube? Мы можем предложить вам 3000 треков (опенинг, эндинг, ост)',
    execute: async function (message, args, locale, sys, skip = false) {
        // return;
        if (!skip && (client.player.getPlayer(message.guild.id) && client.player.getPlayer(message.guild.id).track) && !client.player.queue.get(message.guild.id)) return message.channel.send(`Команда заблокирована на сервере: **Сейчас запущена викторина**`);
        let tip = true;
        let stop = false;
        if (block.has(message.author.id)) return;
        if (message._flags.has('block')) {
            block.add(args[0]);
        }
        let random = client.trivia.randomVid();
        while (!random || !random.song || typeof random.uri !== 'string') {
            random = client.trivia.randomVid();
            console.log('Rotate'.yellow)
        }
        random.song.title = random.song.title.replace(/.[^a-z\d\s]+/gi, '');
        console.log(random)

        if (!random || !random.song || typeof random.uri !== 'string') return message.channel.send(`Мы ничего не подобрали, попробуйте еще!`);
        if (!ISVOICE(message)) return;
        if (client.player.getPlayer(message.guild.id) && client.player.getPlayer(message.guild.id).track && client.player.queue.get(message.guild.id)) return message.channel.send(`Текущий плеер занят, нужно иметь чистое соединение для начала игры!`);
        let song = await client.player.resolveSong([random.uri]);
        client.player.addSong(message.guild.id, song, message)
        song = song.tracks[0];
        let player = client.player.playSong(message, song, {
            volume: 100
        });
        message.channel.send(`Начали, первая подсказка, длина **${random.song.title.length}** символов, ${random.title}.\n**Вводите ваше предположение начав с символа \`>\`\n\`>exit\` чтоб остановить.**`)
        let collector = message.channel.createMessageCollector(u => true);
        setTimeout(() => {
            if (tip) message.channel.send(`Подсказка 2: **${random.song.title.slice(0, random.song.title.length / 4)}**...`)
            //   setTimeout(() => {
            //   if (tip) message.channel.send(`Подсказка 3: **${random.song.title.slice(0, random.song.title.length / 2)}**...`)
            // }, 15000)
        }, 20000)
        collector.on('collect', msg => {
            if (!msg.content.startsWith('>')) return;
            msg.content = msg.content.slice(1, 200)
            if (msg.author.bot) return;
            if (msg.author.id === message.author.id && msg.content === 'exit') {
                stop = true;
                collector.stop();
                client.player.getPlayer(message.guild.id).stopTrack();
            }
            if (!msg.member.voice.channel) return;
            if (!msg.member.voice.channel.members.has(message.author.id)) return;
            tip = false;
            if (!stop) {
                let str = require('string-similarity').compareTwoStrings(random.song.title.toLowerCase(), msg.content.toLowerCase());
                if (str > 0.5) {
                    if (points[msg.author.id]) {
                        points[msg.author.id]++;
                    } else points[msg.author.id] = 1;
                    message.channel.send(`Засчитано! Вы угадали с точностью **${str * 100 | 0}%**, это было **${random.song.title}**\n<https://openings.moe/?video=${random.file}>`);
                } else {
                    message.channel.send(`Неправильно :(\nОтвет: \`${random.song.title}\`, вы были близки на ${str * 100 | 0}%\n<https://openings.moe/?video=${random.file}>`);
                }
                let player = client.player.getPlayer(message.guild.id);
                if (!player) return message.channel.send(`Плеер не пришел на вечеринку...`);
            } else {
                let table = ``
                Object.keys(points).forEach(id => {
                    table += `${client.users.cache.get(id).toString()} - **${points[id]}**\n`
                })
                let embed = new Discord.MessageEmbed()
                .setAuthor(`Таблица лидеров`, message.guild.iconURL())
                .setDescription(table)
                if(Object.keys(points)[0]) message.channel.send(embed);
                points = {};
            }
            player = client.player.getPlayer(message.guild.id)
            player.setVolume(0.1)
            setTimeout(() => player.stopTrack(), 2000)
            collector.stop();

            if (!stop) {
               setTimeout( () => this.execute(message, args, locale, sys, true), 2100)
            }
        });

    }
}