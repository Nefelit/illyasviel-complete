//let { CanvasRenderService } = require('chartjs-node-canvas');
let { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch')
module.exports = {
    name: 'details',
    description: 'Открывает вам вашу медиатеку, там записаны все данные, о том, что вы слушали',
    execute: async function (message, args, locale, system) {
        //	return message.channel.send(`База данных проводит очистку, подождите.`);
        let [result] = await con.query(`SELECT * FROM Analytics WHERE author = ? ORDER BY createdAt DESC`, [message.author.id]);
        if(!result[5]) return message.channel.send(locale.no_result);
        let data = new Map();
        let track = new Map();

        for (let row in result) {
            let info = result[row];

            if (data.has(info.artist)) {
                data.set(info.artist, data.get(info.artist) + 1)
            } else {
                data.set(info.artist, 1)
            }


            if (track.has(info.title)) {
                track.set(info.title, track.get(info.title) + 1)
            } else {
                track.set(info.title, 1)
            }
        }
        track = [...track]
        track = track.sort((x, y) => (y[1] - x[1]));
        data = [...data];
        data = data.sort((x, y) => (y[1] - x[1]));
        data = data.slice(0, data.length > 6 ? 6 : data.length);
        track = track.slice(0, track.length > 6 ? 6 : track.length)
        let embed = () => new MessageEmbed()
            .setAuthor(`${locale.media} ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(locale.description.parse({
                tracks: data.length,
                total: moment.duration(result.reduce((n, row) => n + row.length, 0)).format("dd:hh:mm:ss", { trim: false })
            }));


        let stats = embed()
            .addField(locale.featured, data.map(x => locale.featured_map.parse({
                x: x[0],
                y: x[1]
            })).join("\n"))
            .addField(locale.looping, track.map(x =>{
                if(!x[0]) return;
                return locale.looping_map.parse({
                    track: x[0].length > 45 ? `${x[0].slice(0, 45)}..` : x[0],
                    x: x[1]
                })
        }).join("\n"))

        let history = embed()
            .addField(locale.history, result.slice(0, result.length > 10 ? 10 : result.length).map((x, i) => `\`[${i}]\` **${x.title}**`))
        let pages = new client.pages(message.author.id, [stats, history]);
        if (message._flags.has('chart')) {
            return;
            fetch('https://aspire.su/api/stats').then(data => data.json()).then(async result => {
                let statics = new Map();
                for (let row in result) {
                    let info = result[row];

                    if (statics.has(info.artist)) {
                        statics.set(info.artist, statics.get(info.artist) + 1)
                    } else {
                        statics.set(info.artist, 1)
                    }
                }
                statics = [...statics];
                statics = statics.sort((x, y) => (y[1] - x[1]));
                statics = statics.slice(0, 8)
                let rows = 50;
                let colors = new Array(rows);

                function sin_to_hex(i, phase) {
                    let sin = Math.sin(Math.PI / rows * 2 * i + phase);
                    let int = Math.floor(sin * 127) + 128;
                    let hex = int.toString(16);

                    return hex.length === 1 ? '0' + hex : hex;
                }
                for (let i = 0; i < rows; i++) {
                    let red = sin_to_hex(i, 0 * Math.PI * 4 / 3); // 0 deg
                    let blue = sin_to_hex(i, 1 * Math.PI * 8 / 3); // 120 deg
                    let green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

                    colors[i] = '#' + red + green + blue;
                }
                const configuration = {
                    type: 'pie',
                    data: {
                        labels: statics.map(x => x[0]),
                        datasets: [{
                            label: 'Music',
                            data: statics.map(x => x[1]),
                            backgroundColor: [...colors],
                            borderColor: 'rgba(32,5,137, 1)',
                            borderWidth: 2,
                            fontColor: 'rgba(159,182,196, 1)'
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    maxRotation: 90,
                                    minRotation: 90,
                                    callback: (value) => value
                                }
                            }]
                        }
                    }
                };

                console.log(configuration.data.datasets)

                const chartCallback = (ChartJS) => {

                    // Global config example: https://www.chartjs.org/docs/latest/configuration/
                    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
                    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
                    ChartJS.plugins.register({
                        // plugin implementation
                    });
                    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
                    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
                        // chart implementation
                    });
                };
                const canvasRenderService = new CanvasRenderService(550, 550, chartCallback);
                const image = await canvasRenderService.renderToBuffer(configuration);
                const attach = new MessageAttachment(image, 'i.png');
                total
                    .setAuthor('Людям нравится!', client.user.displayAvatarURL())
                    .setDescription(`${statics.map(x => `**${x[0]}** послушали **${x[1]}** раз!`).join("\n")}`)

                message.channel.send(total);
                message.channel.send(attach)

            });
        }
        pages.send(message.channel);
    }
}
