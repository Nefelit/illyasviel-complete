class BlacklistedUser {
  constructor(id, reason, date) {
    this.id = id;
    this.reason = reason;
    this.date = date;
    this.type = 'User'
  }
}
class BlacklistedGuild {
  constructor(id, reason, date) {
    this.id = id;
    this.reason = reason;
    this.date = date;
    this.type = 'Guild'
  }
}
class BlacklistUsers {
  constructor(blacklist) {
    blacklist.forEach(block => {
      this[block.id] = new BlacklistedUser(block.id, block.reason, block.date)
    });
  }
  get(id) {
    return this[id];
  }

  has(id) {
    return !!this[id];
  };

  first() {
    for (let item in this) {
      return this[item];
      break;
    }
  }
}
class BlacklistGuilds {
  constructor(blacklist) {
    blacklist.forEach(block => {
      this[block.id] = new BlacklistedGuild(block.id, block.reason, block.date)
    });
  }
  get(id) {
    return this[id];
  };

  has(id) {
    return !!this[id];
  };

  first() {
    for (let item in this) {
      return this[item];
      break;
    }
  }

}
class Blacklist{
  constructor(users, guilds) {
    this.users = new BlacklistUsers(users);
    this.guilds = new BlacklistGuilds(guilds);
  }
}

module.exports = {Blacklist};