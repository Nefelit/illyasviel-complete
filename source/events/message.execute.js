let cooldown = new Set();
module.exports = async message => {
    if (!client._ready) return;
    // dev mode   
    if (message.channel.type !== "text" || message.author.bot) return null;
    let data = message.guild.data;
    if (!data) {
        message.guild.data = {
            language: "ru",
            prefix: "i!"
        }
        con.query(`INSERT INTO Guilds (id) VALUES ('${message.guild.id}')`);
    } 
    message.guild.data.language = 'ru';
    let args = message.content
        .slice(message.guild.data.prefix.length)
        .trim()
        .split(/ +/);
    if (!message.content.startsWith(message.guild.data.prefix)) return;
    message._flags = new Set();
    args.map(x => {
        if (x.startsWith('--')) {
            message._flags.add(x.replace('--', ''))
            delete args[args.indexOf(x)];
        }
    });
    const commandName = args.shift().toLowerCase();
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );
    if (!command) return null;
    if (cooldown.has(message.guild.id)) return message.channel.send(`Данный сервер находится в задержке в 1 секунду, нам важна безопасность нашего бота.`);
    cooldown.add(message.guild.id);
    setTimeout(() => { cooldown.delete(message.guild.id) }, 1000)
    command.execute(
        message,
        args,
        Translate.get(message.guild.data.language, command.name),
        Translate.get(message.guild.data.language, 'global')
    );
    let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} ${message.author.id}`, message.author.displayAvatarURL())
        .setDescription(`${message.content}\n\nIN:\nGUILD: ${message.guild.id} ${message.guild.name}\nCHAT: ${message.channel.id} ${message.channel.name}`)
    client.channels.cache.get('674257349569019914').send(embed);
};
