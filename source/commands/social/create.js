let max = 3;
module.exports = {
    name: "create",
    description: "Создает плейлист с заданым названием, если оно не занято<br><code>i!create aspire</code> - Создает плейлист с названием aspire",
    execute: async function (message, args, locale) {
        let [playlist] = await con.query(`SELECT * FROM Playlist WHERE owner = ?`, [message.author.id]);
        if (playlist.length >= 3) return message.channel.send(`❗ ${locale.max_playlist.parse({ max })}`);
        let name = args[0];
        if (!name) return message.channel.send(`❓ ${locale.no_name}`);

        let [results] = await con.query(`SELECT * FROM Playlist WHERE name = ?`, [name]);
        if (results[0]) return message.channel.send(`⚠️ ${locale.already_exits.parse({ name })}`);

        await con.query(`INSERT INTO Playlist (name, owner, songs) VALUES (?,?,?)`, [name, message.author.id, JSON.stringify({ songs: [] })])
        message.channel.send(`${locale.createdNew}`)
    }
}