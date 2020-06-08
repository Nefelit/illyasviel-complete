const fetch = require('request-promise')
module.exports = {
    name: 'lyrics',
    aliases: ['l'],
    description: "Ищет текст к текущей песни, если вы что либо слушаете. Можно так-же указать название самому.",
    execute: async function (message, args, locale) {
        if (!locale) locale = Translate.get('ru', this.name)
        let player = client.player.getPlayer(message.guild.id),
            query;

        if (player && args[0]) {
            query = args.join(" ");
        } else if (player && !args[0]) {
            query = client.player.queue.get(message.guild.id).songs[0].info.title;
        } else if (!player && !args[0]) {
            return message.channel.send(locale.no_query);
        } else if (args[0]) {
            query = args.join(" ")
        }

        const options = {
            uri: `https://api.ksoft.si/lyrics/search?q=` + encodeURIComponent(query),
            json: true,
            headers: {
                'Authorization': config.ksoft_service
            }
        };

        fetch(options).then(async song => {
            let
                took = song.took,
                result = song.data,
                leng = result.length;


            let question = await message.channel.send(`${locale.confirm_query}\n\n${result.map((x, i) => `\`[${i}]\` \`• ${x.name.length > 40 ? x.name.slice(0, 40) + '...' : x.name}\``).join("\n")}`);
            let collector = question.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 15000 });
            collector.on('collect', msg => {
                let int = msg.content;
                question.delete();
                if (isNaN(int) || int < 0 || int > result.lengt - 1) {
                    collector.stop();
                    return;
                }
                result = result[int]
                collector.stop()

                Pages = new client.pages(message.author.id),
                    numOfPages = Discord.Util.splitMessage(result.lyrics, { maxLength: 400, char: '' });
                if (typeof numOfPages === 'string') numOfPages = [numOfPages];

                numOfPages.forEach(page => {
                    let embed = new Discord.MessageEmbed()
                        .setAuthor(`${result.name} от ${result.artist}`, result.album_art ? result.album_art : null, `https://aspire.su/l/?name=${encodeURIComponent(query)}`)
                        .setDescription(page)
                        .setColor("#36393f")
                        .setFooter(locale.string_query.parse({
                            string_query: result.search_str
                        }))
                    Pages.add(embed)
                })
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${result.name} от ${result.artist}`, result.album_art ? result.album_art : null)
                    .setDescription(`${locale.name}: ${result.name}\n${locale.artist}: ${result.artist}\n${locale.album}: ${locale.album_stats.parse({ name: result.album, year: result.album_year })}\n${locale.length}: ${result.lyrics.length}\n${locale.likes}: ${result.popularity}\nSure percentage ${(result.search_score).toFixed(2)}%\n\n${locale.took.parse({ took })}\n[Powered by aspireworld](https://aspire.su/l/?name=${encodeURIComponent(query)}) [and KsoftSI](https://api.ksoft.si/?utm_source=illyasvielMusic)`)
                    .setColor("#36393f")
                    .setThumbnail(result.album_art)
                    .setFooter(`${result.search_str}`)
                Pages.add(embed)
                Pages.send(message.channel)
            })
        }).catch(err => { message.channel.send(locale.none) })
    }
}