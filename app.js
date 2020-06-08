const express = require('express'),
  app = express(),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  logger = require('morgan'),
  rp = require('request-promise'),
  fs = require('fs'),
  cors =  require('cors'),
  bodyParser = require('body-parser'),
  Discord = require('discord.js');


const opts = {
  key: fs.readFileSync('/etc/letsencrypt/live/aspire.su/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/aspire.su/fullchain.pem')
}

const https = require('https').createServer(opts, function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS' || req.method === 'GET') {
    res.writeHead(200);
    res.end();
    return;
  }

});

https.listen(5002);
global.io = require('socket.io')(https);



const config = require('./config.json')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: config.web.cookie_token,
    cookie: { maxAge: 60000 * 60 * 24 * 7 }
  })
)

let api = require('./routes/api')
let admin = require('./routes/admin')
let apiPlayer = require('./routes/player')
let dashboard = require('./routes/dashboard')
let _user = require('./routes/user')
app.use('/api', api)
app.use('/u', admin)
app.use('/api/player', apiPlayer)
app.use('/dashboard', dashboard)
app.use('/user', _user)


app.get('/invite', (req, res) => {
  res.redirect("https://discord.com/api/oauth2/authorize?client_id=678121374887444480&permissions=3532864&redirect_uri=https%3A%2F%2Faspire.su%2Foauth2&response_type=code&scope=bot%20identify")
})

app.get('/', async (req, res) => {
  
  res.render('web/mainpage', {
    user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
    guilds: client.guilds.cache.filter(
      x => {
        return x.members.cache.has(req.session.uid) &&
          x.member(req.session.uid).permissions.has('MANAGE_GUILD')
      })
  })
})

app.get('/logout', (req,res) => {
  req.session.uid = null;
  res.redirect('/')
})

/** 
 * Логин в сайт
 */
app.get('/oauth2', (req, res) => {
  if (req.query.redir && !req.session.redir) req.session.redir = req.query.redir
  if (!req.query.code)
    return res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=678121374887444480&redirect_uri=${config.web.redirect}&response_type=code&scope=identify%20guilds.join%20guilds&permissions=388289`
    )
  rp({
    uri: 'https://discordapp.com/api/v6/oauth2/token',
    method: 'POST',
    form: {
      client_id: '678121374887444480',
      client_secret: config.web.client_secret,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: config.web.redirect,
      scope: 'identify guilds.join'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  }).then(async result => {
    req.session.token = result.access_token;
    rp({
      method: 'GET',
      url: 'https://discordapp.com/api/v6/users/@me',
      headers: {
        Authorization: `Bearer ${result.access_token}`
      },
      json: true
    }).then(async user => {
      req.session.uid = user.id;
      rp({
        method: 'PUT',
        url: `https://discordapp.com/api/guilds/673925010833801262/members/${user.id}`,
        headers: {
          Authorization: `Bot ${config.token}`
        },
        json: true,
        body: {
          access_token: result.access_token,
          roles: ['689147125795258598']
        }
      })

      if (req.query.guild_id) return setTimeout(async() => {
        /**
         * Благодарность за добавление
         */
          return res.render('thanks', {
            guild: client.guilds.cache.get(req.query.guild_id),
            permissions: new Discord.Permissions(+req.query.permissions).toArray(),
            user: req.session.uid ? await client.users.fetch(req.session.uid) : null,
            guilds: client.guilds.cache.filter(
              x => {
                return x.members.cache.has(req.session.uid) &&
                  x.member(req.session.uid).permissions.has('MANAGE_GUILD')
              })
          });
        }, 200) // очень много говнокода
      if (req.session.redir) {
        await res.redirect(req.session.redir)
        req.session.redir = null
      }
      res.redirect('/');
    }).catch(e => res.redirect("/"))
  }).catch(e => res.redirect("/"))
})
app.get('/l', async (req, res) => {
  if (!config.ksoft_service)
    return res.json({ status: false, reason: 'NO_TOKEN_PROVIDED' })
  let query = req.query.name
  if (!query) return res.send('Нет запроса')
  const options = {
    uri: `https://api.ksoft.si/lyrics/search?q=` + encodeURIComponent(query),
    json: true,
    headers: {
      Authorization: config.ksoft_service
    }
  }
  rp(options)
    .then(song => {
      let took = song.took,
        result = song.data[0]
      res.render('lyrics', {
        result
      })
    })
    .catch(err => {
      return res.send('Ничего не найдено')
    })
})


app.get('/commands', async (req, res) => {
  res.render('web/commands', {
    user: req.session.uid ? await client.users.fetch(req.session.uid) : null
})
})
module.exports = app
