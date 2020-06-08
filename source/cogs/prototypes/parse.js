locate = (fullkey, obj) => {
    let keys = fullkey.split(".");
    let val = obj[keys.shift()];
    if (!val) return null;
    for (let key of keys) {
        if (!val[key]) return val;
        val = val[key];
        if (Array.isArray(val)) return val.join("\n");
    }
    return val || null;
};
String.prototype.parse = function (options = {}) {
    if (!this) return this;
    return this.split(" ")
        .map(str =>
            str.replace(
                /\{\{(.+)\}\}/gi,
                (matched, key) => locate(key, options) || matched
            )
        )
        .join(" "); //иди за мной в файл about
};


global.ISVOICE = (message, only = true) => {
    let id = message.guild.me.voice.channel;
    if (id) id = id.id;
    if ((!message.member.voice.channel) || message.member.guild.id !== message.guild.id) {
        message.channel.send(`Вы должны быть в голосовом канале!`)
        return false;
    } else if (id && id !== undefined && message.member.voice.channel.id !== id && only) {
        message.channel.send(`Вы должны быть в одной и той же комнате, что и я!`);
        return false;
    }
    return true;
}