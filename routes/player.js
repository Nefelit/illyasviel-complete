let ms = require('ms');
let express = require('express');
let app = express.Router();

app.get('/volume/*', async (req, res) => {
    let id = req.path.match(/\d/gi);
    if (!id) return res.json({ status: "error" });
    id = id.join("");
    if (!id || !client.guilds.cache.get(id) || !req.session.uid) return res.json({ status: "error" });
    let [data] = await con.query(`SELECT * FROM Guilds WHERE id = ?`, [id]);
    data = data[0];
    if (!data) return res.json({ status: "NOTREGISTER" });
    let guild = client.guilds.cache.get(id);
    let member = guild.member(req.session.uid);
    if (!await member.permissions.has('MANAGE_GUILD')) return res.json({ status: "error" });
    res.json({ status: 'success' })
    let g = req.query;
    if (client.player.getPlayer(id)) client.player.getPlayer(id).setVolume(req.query.defaultVolume > 100 ? 100 : req.query.defaultVolume);
})

let ytdl = require('ytdl-core');

app.get('/*', async (req, res) => {
    let id = req.path.match(/\d/gi);
    if (!id) return res.json({ status: "error" });
    id = id.join("");
    let player = client.player.getPlayer(id);
    let queue = client.player.queue.get(id);
    if (!queue) return res.json({ success: false })
    if (ytdl.validateURL(queue.songs[0].info.uri)) {
        let info = await ytdl.getInfo(queue.songs[0].info.uri);
        res.json({
            player: {
                id: player.channel,
                channel: player.channel,
                position: player.position,
                playing: player.playing,
                timestamp: player.timestamp,
                paused: player.paused,
            },
            queue,
            info
        })
    } else {
        res.json({
            player: {
                id: player.channel,
                channel: player.channel,
                state: player.state,
                playing: player.playing,
                timestamp: player.timestamp,
                paused: player.paused,
            },
            queue
        })
    }
})
module.exports = app;