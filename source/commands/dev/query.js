module.exports = {
    name: 'query',
    description: 'Команда для разработчиков.',
    aliases: ['sql'],
    usage: null,
    ownerOnly: true,

    async execute(message, args) {
        if (!config.owners.includes(message.author.id)) return;
        const { inspect } = require('util');
        const code = args.join(' ');
        await con.query(code).then(query => {
            query = query[0]
            message.channel.send(inspect(query, { depth: 1 }), { code: "js" });
            client.query = query;
        }).catch(err => {
            message.channel.send(`${err.code} ${err.errno} >>\n${err.message} `, { code: "js" })
        });
    }
};