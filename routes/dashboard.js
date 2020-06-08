let ms = require('ms');
let express = require('express');
let app = express.Router();
app.post('/:guild/update/equalizer', async (req, res) => {
    if (!req.session.uid) return res.json({ message: `Доступа нет`, success: false });

    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.json({ message: `Сервер не найден`, success: false });
    let bands = JSON.parse(req.body.bands);
    for (band in bands) bands[band].gain = +bands[band].gain / 100; // Уменьшаем все до понятных боту чисел
    if (!guild.member(req.session.uid).permissions.has('MANAGE_GUILD')) return;


    let player = client.player.getPlayer(guild.id);
    if (player) player.setEqualizer(bands)
    res.json({ success: true })
})
app.post('/:guild/update/volume', async (req, res) => {
    if (!req.session.uid) return res.json({ message: `Доступа нет`, success: false });

    let volume = req.body.volume;
    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.json({ message: `Сервер не найден`, success: false });

    if (!guild.member(req.session.uid).permissions.has('MANAGE_GUILD')) return;
    console.log(`Звук меняется`.green)

    let player = client.player.getPlayer(guild.id);

    if (isNaN(volume)) volume = 20;
    if (volume > 100) volume = 100;
    if (volume < 0) volume = 0;
    if (player) player.setVolume(volume)


    /**
     * MySQL SECTION UPDATE
     */

    guild.data.defaultVolume = volume;
    if (req.body.update) con.query(`UPDATE Guilds SET defaultVolume = ? WHERE id = ?`, [volume, guild.id])
    res.json({ success: true })
})
app.post('/:guild/update', async (req, res) => {
    if (!req.session.uid) return res.json({ message: `Доступа нет`, success: false });

    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.json({ message: `Сервер не найден`, success: false });
    let data = req.body;
    if (!guild.member(req.session.uid).permissions.has('MANAGE_GUILD')) return;
    console.log('Данные меняются...'.green)
    guild.data.prefix = data.prefix
    guild.data.defaultVolume = data.defaultVolume
    guild.data.delayTime = data.delayTime
    guild.data.radioMode = data.radioMode
    guild.data.looping = data.looping
    guild.data.radioURI = data.radioURI
    guild.data.language = data.language

    con.query(`UPDATE Guilds SET
prefix = ?,
defaultVolume = ?,
delayTime = ?,
radioMode = ?,
looping = ?,
radioURI = ?,
language = ?
WHERE id = ?
`, [data.prefix, data.defaultVolume, data.delayTime, data.radioMode, data.looping, data.radioURI, data.language, data.id])
    res.json({ success: true })
})

app.get('/:guild', async (req, res) => {
    if (!req.session.uid) return res.redirect(`/oauth2?redirect=/dashboard/${req.params.guild}`);

    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.send(`Сервер не найден`);
    if (!guild.member(req.session.uid).permissions.has('MANAGE_GUILD')) return res.send("Тебе сюда нельзя :<");

    let [stats] = await con.query(`SELECT * FROM Analytics WHERE guild = ?`, [guild.id]);
    res.render('web/dashboard', {
        user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
        guild,
        stats
    })
})

app.get('/:guild/player', async (req, res) => {
    if (!req.session.uid) return res.redirect(`/oauth2?redirect=/dashboard/${req.params.guild}`);

    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.send(`Сервер не найден`);

    res.render('web/player', {
        user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
        guild
    })
})


app.post('/:guild/player/update', async (req, res) => {
    if (!req.session.uid) return res.json({ success: false, op: data.op });

    let guild = client.guilds.cache.get(req.params.guild);
    if (!guild || guild === null || guild === undefined) return res.json({ success: false, op: data.op });
    let data = req.body;
    if (!guild.member(req.session.uid).permissions.has('MANAGE_GUILD')) return res.json({ success: false, op: data.op });

    let player = client.player.getPlayer(data.guild);
    let queue = client.player.queue.get(data.guild);
    if (!queue.songs[0]) return;

    if (!player) return;

    if (data.op == 'resume') player.setPaused(false)
    if (data.op == 'pause') player.setPaused(true)

    if (data.op == 'seek') player.seekTo(player.position + 10000)
    if (data.op == 'back') player.seekTo(1)
    if (data.op == 'skip') player.stopTrack()

    if (data.op == 'volume_up') player.setVolume((player.volume + 20) > 100 ? 100 : (player.volume + 20))
    if (data.op == 'volume_mute') player.setVolume(1)
    await setTimeout( async () => {
        let nplayer = await client.player.getPlayer(data.guild);
         res.json({
            success: true, op: data.op, state: {
                volume: nplayer.volume,
                paused: nplayer.paused,
                position: [nplayer.position, queue.songs[0] && queue.songs[0].info.length]
            }
        });
    }, 100)

})

module.exports = app;
