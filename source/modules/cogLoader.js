const loadBlacklist = async() => {
    let [users] = await con.query(`SELECT * FROM blacklist WHERE type = "user"`);
    let [guilds] = await con.query(`SELECT * FROM blacklist WHERE type = "guild"`);
    let { Blacklist } = require("../cogs/blacklist");
    client.blacklist = new Blacklist(users, guilds);
};
const loadPrototypes = async() => {
    require("../cogs/prototypes/parse");
    require("../cogs/prototypes/proto");
};

module.exports = {
    loadBlacklist,
    loadPrototypes
};