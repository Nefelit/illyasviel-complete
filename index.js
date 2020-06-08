console.clear();

const mysql = require("mysql2/promise"),
    fs = require("fs"),
    ora = require("ora"),
    server = require("./app");

const { loadBlacklist, loadPrototypes } = require("./source/modules/cogLoader");
const { AspirePlayer } = require('./source/structures/AspirePlayer');
//const { PlayerNodes, __nodes } = require('./Lavalink/Nodes.js');

global.Discord = require("discord.js");
global.config = require("./config");
global.Enmap = require("enmap");
global.moment = require('moment');
let m;
m = require('moment-duration-format');
m(moment)
m = require('moment-timezone');
m(moment, 'Europe/Moscow')
moment.locale('ru');
global.client = new AspirePlayer({
    disableMentions: "everyone",
    messageSweepInterval: 60,
    messageCacheLifetime: 100,
    messageCacheMaxSize: 300,
    nodes: [{
        "host": "localhost",
        "port": 2333,
        "password": "qDI83K$03KD~D$",
        "id": "1"
    }, {
        "host": "localhost",
        "port": 5000,
        "password": "test",
        "id": "2"
    }]
});
client._ready = false;
client.options.ws.properties.$browser = 'Discord Android';
global.colors = require("colors");
let sqlLoading = ora("Подключаемся к базе данных..").start();
global.con = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    charset: "utf8mb4",
    insecureAuth: true
});
sqlLoading.color = "#00ff00";
sqlLoading.succeed("Успешное подключение к MySQL");
client.commands = new Enmap();
client.guildConfig = new Enmap();
const loadCogsModules = async () => {
    let loading = ora(`Загрузка cogs..`).start();
    await loadBlacklist().then(r => {
        loading.text = "Черный список загружен.";
    });
    await loadPrototypes().then(r => {
        loading.text = "Прототайпы загружены.";
    });
    await loading.succeed(`Cogs загружены.`);
};
const loadEvents = async () => {
    let loadingEvents = ora(`Начинаем загрузку...`).start();
    fs.readdirSync("./source/events/")
        .filter(event => event.endsWith(".js"))
        .forEach((event, index) => {
            const loadedEvent = require(`./source/events/` + event);
            let eventName = event.split(".")[0];
            client.on(eventName, loadedEvent);
            delete require.cache[require.resolve(`./source/events/` + event)];
            loadingEvents.text = `Ивенты: ${index} | Загружены.`;
        });

    loadingEvents.succeed();
};
const loadCommands = async () => {
    let loadedCommands = 0;
    let loadingCommands = ora(`Начинаем загрузку...`).start();
    let Command = require("./source/structures/Command");
    fs.readdirSync(`./source/commands`).forEach(module => {
        fs.readdirSync(`./source/commands/${module}`)
            .filter(x => x.endsWith(".js"))
            .forEach(cmd => {
                let command;
                (command = require(`./source/commands/${module}/` + cmd)),
                    (command.module = module);
                command.path = command;
                if (module === "dev") command.ownerOnlyUsage = true;
                client.commands.set(command.name, new Command(command));
                loadedCommands++;
                loadingCommands.text = `Команды: ${loadedCommands} | Загружены.`;
            });
    });
    loadingCommands.succeed();
};

const run = async () => {
    let loading = ora("Начинаем загрузку...").start();
    await loadCommands().then(r => {
        loading.text = "Команды загружены";
    });

    await loadEvents().then(r => {
        loading.text = "Ивенты загружены";
    });
    await loadCogsModules().then(r => {
        loading.text = "Cogs загружены";
    });
    loading.succeed(`Все подгружено.`);
    server.listen(3333, function () {
        let Translate = require("./source/cogs/translate");
        global['Translate'] = new Translate(); //TODO: Удалить все связанное с этим, и оставить бота на русском, или дать шанс на мульти язык, требуется только перевод, буду всем благодарен, если используете пример где используется locale
        ora().start().succeed(`Вебсайт запущен и прослушивается на порту 3333`);
        ora().start().succeed(`Вебсокет запущен, и готов отправлять/принимать данные!`);
        console.log(`Переводчик подключен`.green);
        let Pages = require('./source/plugins/pagination/index');
        let Query = require('./source/plugins/search_query/index');
        Pages.inject(client, 'pages');
        console.log(`Плагин: Страницы подключены`.green)
        Query.inject(client, 'find');
        console.log(`Плагин: Поиск подключен`.green)
    });
};
let loading = ora(`Авторизируюсь...`).start();
client.on(`ready`, async () => {
    
    run().then(async r => {
        loading.color = "00ff00";
        loading.succeed(`Клиент авторизован в ${client.user.tag}`);

        let [guilds] = await con.query(`SELECT * FROM Guilds`);
        setTimeout(() => {
            setInterval(() => {
                let users = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0) * 3
                io.sockets.emit('stats', {
                    users,
                    guilds: client.guilds.cache.size
                })
            }, 1000)
        for (let guild in guilds) {
            guild = guilds[guild];
            if (client.guilds.cache.get(guild.id)) {
                client.guilds.cache.get(guild.id).data = guild;
            }
        }
        client._ready = true
    }, 3000)
    });
      setTimeout(async () => {
          let [guilds] = await con.query(`SELECT * FROM Guilds WHERE radioMode != ?`, ['0']);
          for (guild in guilds) {
              guild = guilds[guild];

              let g = client.guilds.cache.get(guild.id);
              if (g && g.channels.cache.get(guild.radioMode))
                  try {
                      console.log(`Settuping radio for "${g.name}"`.green)
                      let track = await client.player.resolveSong([guild.radioURI]);
                      if(!track.tracks[0]) return;
                      client.player.addSong(g.id, track.tracks[0]);
                      client.player.playSong({
                          channel: guild.radioMode,
                          guild: guild.id,
                          isStream: true
                      }, track.tracks[0], null, true)
                  } catch (error) {
                      console.error(error)
                  }
          }
      }, 4000)
});

client.login(config.token).then(r => {
    loading.text = "Токен подставлен, авторизуюсь...";
});

module.exports = {
    loadEvents,
    loadBlacklist,
    loadCommands,
    loadCogsModules,
    loadPrototypes
};

