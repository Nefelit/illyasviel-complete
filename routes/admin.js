const config = require("../config.json")
let express = require('express');
let app = express.Router();
let allowed = config.web.allowed;

app.get('/report', async (req, res) => {
    req.session.ip = req.clientIp;
    let id = req.session.uid;
    let user = client.guilds.cache.get('549272364345458725').member(id);
    if (!user) return res.redirect('/oauth2?redir=https://aspire.su/u/report');
    res.render('report', {
        user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
        member: user,
        guilds: client.guilds.cache.filter(x => x.members.cache.has(req.session.uid) && x.member(req.session.uid).permissions.has('MANAGE_GUILD'))
    });
})

app.get('/add-partner', async (req, res) => {
    req.session.ip = req.clientIp;
    let id = req.session.uid;
    let user = client.guilds.cache.get('549272364345458725').member(id);
    if (!user) return res.redirect('/oauth2?redir=https://aspire.su/u/add-partner');

    res.render('partner', {
        user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
        guilds: client.guilds.cache.filter(x => x.members.cache.has(req.session.uid) && x.member(req.session.uid).permissions.has('MANAGE_GUILD'))
    });
})

module.exports = app;
