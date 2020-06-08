let ms = require('ms');
let express = require('express');
let app = express.Router();
let allowed = ['627926227935690780', '621945913518325760', '651154101551235112', '549275699354271765'] // я его уже вставил
app.get('/discrim', async (req, res) => {
    let names = client.users.filter(x => x.discriminator === req.query.input).map(x => x.tag);
    res.json(names.slice(0, 30))
});

app.get('/report/', async (req, res) => {
    console.log(req.query)
    let channel = client.channels.cache.get('688667297812054026');
    let id = req.session.uid;
    let user = client.users.fetch(id);
    if (!user) return res.json({ 'status': 'error' })

    if (req.query.description.length < 3 || req.query.description.length > 1999) return res.json({ status: 'errored', message: "Вы указали либо меньше 3 символов, либо больше 2000 в описание" });
    let ip = req.session.ip;
    let proof = req.query.proof.split(',')
    let author = await client.users.fetch(req.query.author);
    let reportUser = await client.users.fetch(req.query.id);

    if (!proof[0] || !reportUser || !author) return res.json({ status: 'errored', message: "Цель не найдена, либо вы не указали пруф." });
    let embed = new Discord.MessageEmbed()
        .setColor('#C70039')
        .setAuthor(`${author.tag} прислал репорт!`, author.displayAvatarURL())
        .addField(`Автор репорта`, `ID: ${author.id}\n TAG: ${author.tag}\nMENTION: ${author}`, true)
        .addField(`Цель репорта`, `ID: ${reportUser.id}\n TAG: ${reportUser.tag}\nMENTION: ${reportUser}`, true)
        .addField(`Доказательство и прочее`, `${req.query.description}\n\n**[ПРУФ ПРИКЛЕПЛЕН НИЖЕ](${req.query.proof[0]})**\nIP: ${ip}`)
        .setImage(proof.shift());
    channel.send(embed);
    proof.forEach(image => channel.send(new Discord.MessageEmbed().setColor('#C70039').setImage(image)));
    return res.json({ 'status': 'success' });
})
app.get('/partner/', async (req, res) => {
    console.log(req.query)
    let channel = client.channels.cache.get('688667274541793281');
    let id = req.session.uid;
    let user = client.users.fetch(id);
    if (!user) return res.json({ 'status': 'error' })
    console.log(req.query.description)
    if (req.query.description.length < 3 || req.query.description.length > 1999) return res.json({ status: 'errored', message: "Вы указали либо меньше 3 символов, либо больше 2000 в описание" });
    let ip = req.session.ip;
    let author = await client.users.fetch(req.query.author);
    let data = req.query;
    let guild = client.guilds.cache.get(data.guild.split('-')[0]);
    if (!guild) return res.json({ status: 'errored', message: "На данном сервере должен находиться музыкальный бот." });
    let embed = new Discord.MessageEmbed()
        .setColor('#C70039')
        .setAuthor(`${author.tag} оставил заявку на партнерку`, author.displayAvatarURL())
        .setDescription(
            `\`${data.lastName} ${data.firstName}\` :: ${data.user_type} лицо, которое хочет верифицировать \`${data.partner_type}\`.

Сервер \`${guild.name}\` имеет \`${guild.memberCount}\` участников.\n
Владелец: ${guild.owner.user} (\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`))`
        )
    channel.send(embed).then(msg => {
        channel.send(new Discord.MessageEmbed()
            .setDescription(req.query.description))
    });
    return res.json({ 'status': 'success' });
})


app.get('/update/*', async (req, res) => {
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
    con.query(`UPDATE Guilds SET prefix = ?, delayTime = ?, looping = ?, radioMode = ?, radioURI = ?, language = ? WHERE id = ?`, [g.prefix, ms(g.delayTime), g.looping, g.radioMode, g.radioURI, g.language, id])
});

app.get('/stats', async (req, res) => {
    let [data] = await con.query(`SELECT * FROM Analytics ${req.query.limit ? `WHERE author = ?` : ''}  ${req.query.private ? `LIMIT ?` : ''}`, req.query.private && req.query.limit ? [req.session.uid, req.query.limit] : req.query.private ? [req.session.uid] : [req.query.limit])
    if (!req.session.uid && req.query.private) return res.json({ reason: `No user` });

    res.json(data);
})
app.get('/g/*', async (req, res) => {
    let id = req.path.match(/\d/gi);
    if (!id) return res.json({ reason: `Стой, это же нелегально..` })
    id = id.join("");
    if (!id || !client.guilds.cache.get(id) || !req.session.uid) return res.json({ success: false, reason: 'NO AUTH' })
    let guild = client.guilds.cache.get(id);
    let member = guild.member(req.session.uid);
    if (!await member.permissions.has('MANAGE_GUILD')) return res.redirect('/');
    let [data] = await con.query(`SELECT * FROM Guilds WHERE id = ?`, [id]);
    data = data[0];
    if (!data) return res.json({
        success: false,
        reason: 'No record in DATABASE, please write a message'
    })
    let channels = [];
    guild.channels.cache.filter(x => x.type === 'voice').map(x => {
        channels.push({
            name: x.name,
            id: x.id,
            type: x.type
        })
    })
    res.json({
        success: true,
        entry: data.entry_id,
        data: {
            prefix: data.prefix,
            name: guild.name,
            memberCount: guild.memberCount,
            channels,
            delayTime: data.delayTime,
            defaultVolume: data.defaultVolume,
            radioMode: data.radioMode,
            looping: data.looping,
            radioURI: data.radioURI
        }
    })
})

module.exports = app;