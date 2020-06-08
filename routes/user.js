const app = require('express').Router();

app.get('/*', async (req, res, next) => {
    if(!req.session.uid) {
        req.session.redir = req.path;
        return res.redirect("/oauth2");
    }
    let [playlist] = await con.query(`SELECT * FROM Playlist WHERE owner = ?`, [req.session.uid]);
    res.locals.user = client.users.cache.get(req.session.uid);
    res.locals.user.playlists = playlist;
    res.locals.user.guilds = client.guilds.cache.filter(
        x => {
          return x.members.cache.has(req.session.uid) &&
            x.member(req.session.uid).permissions.has('MANAGE_GUILD')
        })
    next();
})

app.get('/', async (req,res, next) => {
    let id = req.session.uid;
    res.render('web/user/profile')
})

module.exports = app;