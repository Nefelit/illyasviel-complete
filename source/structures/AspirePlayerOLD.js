/**
 * Shoukaku edit!
 * 2.2.3 version
 */

const { Shoukaku } = require("shoukaku");
const { Client } = require("discord.js");
const TriviaManager = require('./TriviaManager');
const
    Enmap = require('enmap'),
    fetch = require('node-fetch');


const LavalinkServer = [
    { name: 'Localhost', host: 'localhost', port: 2333, auth: 'aspire music bots' },
    { name: 'Andesite', host: 'localhost', port: 5000, auth: 'test' },
];
const ShoukakuOptions = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 };

class AspirePlayerManager extends Shoukaku {
    constructor(...args) {
        super(...args);
        this.queue = new Enmap();
    }
    /**
     * Ресолвинг передаваемых данных / поиск по запросу
     * @param {String} id Айди сервера
     * @param {Object} args Передаваемый запрос разбитый на массив
     */
    async resolveSong(id, args) {
        let type, song, name, query = args.join(" ");
        if (query.match('http')) {
            type = '', name = query;
        } else if (query.match(/youtube.com\/playlist/)) {
            type = '', name = query;
        } else if (['soundcloud', 'sc', 'soundc'].includes(args[0])) {
            args.shift();
            type = 'sc', name = args.join(' ');
        } else if (['bc', 'band', 'bandcamp'].includes(args[0])) {
            args.shift();
            type = 'bc', name = args.join(' ');
        } else {
            type = 'yt', name = query
        };
        let searchQuery = `${type}${type ? 'search:' : ''}${name}`;
        const node = this.player.idealNodes.first();
        const params = new URLSearchParams();
        params.append("identifier", searchQuery);
        return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } })
            .then(res => res.json())
            .then(data => {
                data.node = node
                return (data)
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    };
    shuffle(id) {
        let array = this.queue.get(id).songs;
        if (this.player.getPlayer(id).track === this.player.queue.get(id).songs[0].track) array.shift();
        let currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return this.queue.set(id, array, 'songs');
    }
    addSong(id, song) {
        let queue = this.queue.get(id);
        let reData = {
            id,
            songs: [song]
        };
        if (!queue) {
            queue = this.queue.ensure(id, reData);
        } else return this.queue.push(id, song, 'songs');
    }
    displayQueue(id, page = 1) {
        let queue = this.queue.get(id).songs;
        let queueText = '';
        let text = ``;
        text += `Сейчас играет: ${queue[0].info.title}\n----------------------------------------------------\n\n`;
        queue.shift();
        for (let i = 0 + ((page - 1) * 10); i < 10 * page; i++) {
            if (queue[i] && isNaN(queue[i])) {
                let Song = queue[i].info;
                let title = Song.title.length > 60 ? Song.title.slice(0, 60) + '...' : Song.title;
                queueText += `\`[${i}]\` [${title}](${Song.uri})\n`;
            } else queueText += `\`[${i}]\` - - - - - - - - - - - - - -\n`;
        };
        text += queueText;
        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue for ${this.guilds.cache.get(id).name}..`)
            .setDescription(text)
            .setFooter(`••• Страница: ${page} • ${queue.length} треков осталось`)

        return embed;
    }
    nowPlayingRaw(id) {
        const guild = this.guilds.cache.get(id);
        const player = this.player.getPlayer(id);
        const queue = this.player.queue.get(id);
        const songs = queue.songs;

        let time = 0;

        songs.map(x => time += x.info.length);
        return {
            currentSong: songs.shift(),
            nextSongs: songs,
            player,
            guild,
            time
        }
    }
    async nowPlaying(id, channel) {
        const guild = this.guilds.cache.get(id);
        const player = this.player.getPlayer(id);
        const queue = this.player.queue.get(id);
        const songs = queue.songs;
        let embed = new Discord.MessageEmbed()
            .setColor('#1c2260')
            .setDescription(`Сейчас играет **${songs[0].info.title}**`)
            .setAuthor(`Now playing queue for ${guild.name}`, guild.iconURL() ? guild.iconURL() : null)
            .setFooter(`••• ${songs.length} песен в очереди..`)
        if (channel) return channel.send(embed);
        return embed;
    }
    async playSong(message, song, options) {
        // if (!song && message && message.channel) message.channel.send('Обнаружен пустой трек;');
        if (!song) return;
        if (!message) return;
        if (!message.author) {
            message = {
                isFake: true,
                guild: {
                    id: message.guild
                },
                member: {
                    voice: {
                        channel: this.channels.cache.get(message.channel)
                    }
                }
            }
        }
        let [infoData] = await con.query(`SELECT * FROM Guilds WHERE id = ?`, [message.guild.id]);
        //  if (!song.info.isStream && song.info.requestBy && song.info.length > 30000) await con.query(`INSERT INTO Analytics (author, artist, title, length) VALUES (?, ?, ?, ?)`, [song.info.requestBy ? song.info.requestBy : null, song.info.author, song.info.title, song.info.length])
        infoData = infoData[0];
        /* if (!message.member.voice.channel) {
             this.queue.delete(message.guild.id)
             if (this.players.get(message.guild.id)) this.players.get(message.guild.id).stop();
             this.players.delete(message.guild.id);
         }*/
        const player = await this.player.joinVoiceChannel({
            guild: message.guild.id,
            voiceChannelID: message.member.voice.channel.id,
            host: this.player.idealNodes.first().host
        }, options ? options : { selfdeaf: true });
        player.setVolume((options && options.volume) ? (options.volume) : infoData.defaultVolume);
        player.playTrack(song.track);


        const cleanFunction = (param) => {
            console.log(param);
            player.disconnect();
        }

        player.on('end', cleanFunction);
        player.on('closed', cleanFunction);
        player.on('error', cleanFunction);
        player.on('nodeDisconnect', cleanFunction);

        player.once("error", err => {
            try {
                if (err.reason === 'Disconnected.') {
                    this.players.delete(message.guild.id);
                    this.queue.delete(message.guild.id);
                    if (message.channel) {
                        //  message.channel.send(`Слушайте, в след. раз не нужно выгонять меня через красную кнопку, у меня есть и команды :d`);
                    }
                    return;
                }
                if (err.reason && err.reason.startsWith('Closed by client') && message.channel) return;// message.channel.send(`Error: Lavaplayer приказал закрыть соединение с этим сервером по приказу разработчика или при попытке исправить клиент.`);
                if (err.error.startsWith('Something broke when playing the track') && message.channel) return;// message.channel.send(`Error: Неизвестная ошибка случилась, при попытке считать трек, это не ошибка бота.\nВнимание, бот не может играть стримы с youtube, мы работаем над этим.`);
                if (err.error.startsWith('This video may be inappropriate') && message.channel) return message.channel.send(`Error: <a:error:658376342190161960> Это видео может оказаться неприемливым для некоторых слушателей.`).then(m => m.delete(1000))
            } catch (err) {
                if (message) {
                    message.channel.send(`Ваша сессия больше не активна.`);
                }
                return;
            }
        });
        player.once("end", async endData => {
            if (message.guild && this.queue.get(message.guild.id) && this.queue.get(message.guild.id).np) {
                let np = this.queue.get(message.guild.id).np;
                let msg = await this.channels.cache.get(np.channel).messages.fetch(np.message);
                msg.delete();

                setTimeout(() => {
                    if (!message.guild.data.language) message.guild.data.language = 'en';
                    this.commands.get('np').execute(message, []);
                }, 5000)
            }
            let [data] = await con.query(`SELECT * FROM Guilds WHERE id = ?`, [message.guild.id]);
            data = data[0];
            if (!this.queue.get(message.guild.id)) return this.player.leave(message.guild.id);
            if (data.looping == '1') {
                this.queue.push(message.guild.id, this.queue.get(message.guild.id).songs[0], 'songs');
                this.queue.delete(message.guild.id, 'songs[0]')
            } else if (data.looping == '2') {

            } else {
                this.queue.delete(message.guild.id, 'songs[0]')
            }
            if (endData.reason === 'REPLACED') return;
            let song = this.queue.get(message.guild.id).songs[0];
            if (!song) {
                this.player.leave(message.guild.id);
                if (message.channel) return message.channel.send("Больше нечего играть! Отключаюсь!");
                return;
            } else {
                if (!typeof song === 'object') return this.player.leave(message.guild.id);
                if (!isNaN(data.delayTime) && data.delayTime !== null && data.delayTime < 1000 * 60 * 3) {
                    setTimeout(() => {
                        this.player.playSong(message, song);
                    }, data.delayTime)
                } else {
                    this.player.playSong(message, song);
                }
            };
        });
    }
    _setupShoukakuEvents() {
        this.shoukaku.on('ready', (name) => console.log(`Lavalink Node: ${name} is now connected`));
        // You must handle error event
        this.shoukaku.on('error', (name, error) => console.log(`Lavalink Node: ${name} emitted an error.`, error));
        this.shoukaku.on('close', (name, code, reason) => console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`));
        this.shoukaku.on('disconnected', (name, reason) => console.log(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`));
    }
    login(token) {
        this._setupShoukakuEvents();
        // this._setupClientEvents();
        return super.login(token);
    }
}
class AspirePlayer extends Client {
    constructor(...args) {
        super(...args);

        this.player = "Player is not connected";
        this.trivia = new TriviaManager();
        this.on('ready', async () => {
            this.player = new AspirePlayerManager(this, LavalinkServer, ShoukakuOptions);
        })
    };
}
module.exports = {
    AspirePlayer,
    AspirePlayerManager
}