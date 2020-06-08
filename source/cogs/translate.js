class TranslateManager {
    constructor(languages = ["ru", "en"]) {
        this.languages = languages;
    }
    get(language, command) {
        delete require.cache[require.resolve("../../locales/" + language)]
        let commands = require("../../locales/" + language);
        if (!command) return commands;
        let cmd = commands[command];
        return cmd;
    }
}

module.exports = TranslateManager;