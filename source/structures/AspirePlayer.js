const { Shoukaku } = require("shoukaku");
const { Client } = require("discord.js");
const TriviaManager = require('./TriviaManager');
const
    Enmap = require('enmap'),
    fetch = require('node-fetch');

const ShoukakuOptions = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 };



class AspirePlayer extends Shoukaku {
    constructor(...args) {
        super(...args)

        this.queue = new Enmap('queue');
    }

    prepareSong(song) {
        if (!song.info) return song;
        let getYouTubeID = require('get-youtube-id');
        let id = getYouTubeID(song.info.uri);
        if (!id && song.info.uri.length === 11) {
            id = song.info.uri
        };

        song.info.thumbnail = {
            0: 'http://img.youtube.com/vi/' + id + '/maxresdefault.jpg',
            1: 'http://img.youtube.com/vi/' + id + '/maxres1.jpg',
            2: 'http://img.youtube.com/vi/' + id + '/maxres2.jpg',
            3: 'http://img.youtube.com/vi/' + id + '/maxres3.jpg',
        }
        /**
         * Секции в видео
         */
        /*
        require('ytdl-core').getBasicInfo(id).then(r => {
            let result = r.playerResponse.videoDetails.shortDescription.match(/(^\[?([0-9]{1,2}:[0-9]{1,2})\]?[^A-z]+(.*)$)/gm);
            song.info.sections = result?.map(x => {
                x = x.split(' ')
                return [x.shift().match(/(\d+)(?::(\d\d))?\s*(p?)/), x.join(" ")]
            }) || []
        })
        */



        return song;
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
            .setTitle(`Queue for ${client.guilds.cache.get(id).name}..`)
            .setDescription(text)
            .setFooter(`••• Страница: ${page} • ${queue.length} треков осталось`)

        return embed;
    }

    shuffle(id) {
        let songs = this.queue.get(id).songs;
        let song = songs.shift(); // wait...
        let currentIndex = songs.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = songs[currentIndex];
            songs[currentIndex] = songs[randomIndex];
            songs[randomIndex] = temporaryValue;
        }
        songs.unshift(song) // welcome back
        return this.queue.set(id, songs, 'songs');
    }

    nowPlayingRaw(id) {
        const guild = client.guilds.cache.get(id);
        const player = client.player.getPlayer(id);
        const queue = client.player.queue.get(id);
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
        const guild = client.guilds.cache.get(id);
        const queue = client.player.queue.get(id);
        const songs = queue.songs;
        let embed = new Discord.MessageEmbed()
            .setColor('#1c2260')
            .setDescription(`Сейчас играет **${songs[0].info.title}**`)
            .setAuthor(`Now playing queue for ${guild.name}`, guild.iconURL() ? guild.iconURL() : null)
            .setFooter(`••• ${songs.length} песен в очереди..`)
        if (channel) return channel.send(embed);
        return embed;
    }

    async playSong(message, song, options, radio) {
        let player, id;
        const node = client.player.getNode() // ideal Node;
        id = message.guild && message.guild.id || message.guild;

        if (this.getPlayer(id)) {
            player = this.getPlayer(id)
        } else {
            try {
                player = await node.joinVoiceChannel({
                    guildID: id,
                    voiceChannelID: message.member ? message.member.voice.channel.id : message.channel,
                }, options ? options : { selfdeaf: true });
            } catch (err) {
                if (message.channel && message.channel.send) {
                    message.channel.send(`Прости, но после 15-ти секунд я все еще не в твоих обьятиях... Прав у меня нет, если точнее..\n\`${err.message}\``)
                    // Найс заглушил по еблански
                } else {
                    console.log(err.message)
                }
            }
        }
        if (!player) {
            console.log(`Плеер для ${message.guild.name || 'неизвестного сервера'} не установлен, фиксирую этот инцидент.`.red)
            return;
        }
        player.playTrack(song.track, options ? options : { selfdeaf: true });


        ///////////////////////////////////////
        //////////////////////////////////////
        io.sockets.emit('next_song', {
            new_song: song.info,
            message: 'Играю дальше.',
            guild_id: id,
            state: {
                volume: player.volume,
                paused: player.paused,
                bands: player.bands,
                position: player.position
            }
        })

        ///////////////////////////////////////
        //////////////////////////////////////

        const cleanFunction = (t) => {
            console.log(t)
        }

        player.once('closed', cleanFunction)
        player.once('nodeDisconnect', cleanFunction)


        player.once('error', async error => {
            if (error.reason === 'Disconnected.') {
                player.disconnect();
            }
        })
        player.on('end', async data => {
            if (data.reason === 'REPLACED') return console.log('replaced');
            if (data.reason === 'LOAD_FAILED') {
                if (message.channel) message.channel.send(`Загрузка трека не удалась, пропускаю`)
            }
            if (data.reason !== 'REPLACED') player.removeAllListeners(); // Удалить end ивент (потому что once Работает один раз, а on может быть затригеррен через REPLACED)
            let old_song = this.queue.get(id)?.songs[0]?.info;

            /** Аналитика */
            if (!old_song || old_song.isStream || !old_song.requestBy || old_song.length < 30000) {
            } else await con.query(`INSERT INTO Analytics (guild, author, artist, title, length) VALUES (?, ?, ?, ?, ?)`, [id, old_song.requestBy ? old_song.requestBy : null, old_song.author, old_song.title, old_song.length])

            /** Луупы */
            if (!message.guild.data) message.guild.data.looping = 0;
            if (message.guild.data.looping == 2) {
                // IGNORE QUEUE SLICE
            } else if (message.guild.data.looping == 1) {
                // PUSH IT BACK
                this.addSong(id, this.queue.get(id).songs[0], message);
                this.queue.delete(message.guild.id, 'songs[0]')
            } else {
                // JUST DELETE IT
                this.queue.delete(message.guild.id, 'songs[0]')
            }

            if (this.queue.get(id).songs.length) {
                this.playSong(message, this.queue.get(id, 'songs[0]'))

                ///////////////////////////////////////
                //////////////////////////////////////
                io.sockets.emit('next_song', {
                    old_song,
                    new_song: this.queue.get(id, 'songs[0].info'),
                    message: 'Песня закончилась, играю дальше.',
                    guild_id: id,
                    state: {
                        volume: player.volume,
                        paused: player.paused,
                        bands: player.bands,
                        position: player.position
                    }
                })
            } else {
                io.sockets.emit('next_song', {
                    old_song,
                    new_song: null,
                    message: 'Песня закончилась, список пуст.',
                    state: {
                        volume: player.volume,
                        paused: player.paused,
                        bands: player.bands,
                        position: player.position
                    }
                })

                ///////////////////////////////////////
                //////////////////////////////////////
                if (message.channel) {
                    let m = await message.channel.send(`⏹️ **Треков больше не осталось**, добавьте еще треков, или я выйду через **1 минуту**.`);
                    if (message.channel) setTimeout(() => {
                        if (this.queue.get(id) && !this.queue.get(id).songs.length) {
                            this.queue.delete(id)
                            player.disconnect();
                            m.edit('⏹️ **Я покинула канал из-за неактивности в 1 минуту.**')
                        }
                    }, 60000)
                }

            }
        })
    }
    async resolveSong(args) {
        let type, name, provider, start = 0, query = args.join(" ");
        if (query.match(/([\?|\&]t=\d*)/)) {
            start = query.match(/[\?|\&]t=(\d*)/)[1];
        }
        if (query.match('http')) {
            type = '', name = query, provider = 'http';
        } else if (query.match(/youtube.com\/playlist/)) {
            type = '', name = query, provider = 'youtube playlist';
        } else if (['soundcloud', 'sc', 'soundc'].includes(args[0])) {
            args.shift();
            type = 'sc', name = args.join(' '), provider = 'soundcloud';
        } else if (['bc', 'band', 'bandcamp'].includes(args[0])) {
            args.shift();
            type = 'bc', name = args.join(' '), provider = 'bandcamp';
        } else {
            type = 'yt', name = query, provider = 'youtube'
        };
        let searchQuery = `${type}${type ? 'search:' : ''}${name}`;
        const node = client.player.getNode();
        const params = new URLSearchParams();
        params.append("identifier", searchQuery);
        return fetch(`${node.rest.url}loadtracks?${params.toString()}`, { headers: { Authorization: node.auth } })
            .then(res => res.json())
            .then(data => {
                data.start = start;
                data.node = node
                data.provider = provider
                return (data)
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    };
    addSong(id, song, message) {
        if (!song) return;
        let played = false, queue = this.queue.get(id);
        if (song[0]) {
            for (let s in song) song[s] = this.prepareSong(song[s])
        }

        if (queue && song[0]) {
            if (!queue.songs.length) played = true;
            if (!song[0]) this.queue.push(id, song, 'songs')

            let newSongs = [...queue.songs].concat(song);
            if (song[0]) this.queue.set(id, newSongs, 'songs')
            if (message) this.queue.set(id, message.channel.id, 'bound')
            if (played) {
                this.playSong(message, song[0] ? song[0] : song)
            }
        } else {
            if (!song[0] && !queue?.songs?.length) this.queue.set(id, [song], 'songs')
            if (!song[0] && queue?.songs?.length) this.queue.push(id, song, 'songs')
            if (song[0] && !queue?.songs?.length) this.queue.set(id, song, 'songs')
            if (song[0] && queue?.songs?.length) this.queue.push(id, song, 'songs')
            this.queue.set(id, id, 'id')
            if (message) this.queue.set(id, message.channel.id, 'bound')
        }
    }
}

class AspireClient extends Client {
    constructor(opts) {
        super(opts);
        this.trivia = new TriviaManager();
        this.player = new AspirePlayer(this, [{
            "host": "localhost",
            "port": 2333,
            "auth": "qDI83K$03KD~D$",
            "name": "local"
        }], ShoukakuOptions);
    }

    login(token) {
        this._setupShoukakuEvents();
        return super.login(token);
    }


    _setupShoukakuEvents() {
        this.player.on('ready', (name) => setTimeout(() => console.log(`[LAVALINK]: Сервер ${name} подключен`.green), 2000));
        this.player.on('error', (name, error) => console.log(`[LAVALINK]: ${name} прислал ошибку`.red, error));
        this.player.on('close', (name, code, reason) => console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`));
        this.player.on('disconnected', (name, reason) => console.log(`Lavalink Node: ${name} отключен. Reason: ${reason || 'No reason'}`));
    }
}

module.exports = {
    AspirePlayer: AspireClient
}
