module.exports = {
    name: 'eval',
    description: 'Команда для разработчиков',
    usage: null,
    ownerOnly: true,

    async execute(message, args) {
        if (!config.owners.includes(message.author.id)) return;
        const { inspect } = require('util');
        const code = args.join(' ');
        const token = client.token.split('').join('[^]{0,2}');
        const rev = client.token.split('').reverse().join('[^]{0,2}');
        const filter = new RegExp(`${token}|${rev}`, 'g');
        try {
            let hrDiff;
            const hrStart = process.hrtime();
            hrDiff = process.hrtime(hrStart);
            let output = eval(`${code}`);
            let type = typeof output;
            if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, '[TOKEN]');
            output = clean(output);
            if (output === undefined || output === 'undefined' || output === null || output === 'null') output = 'Empty response: ' + output;
            if (output.length < 1950) {
                //Отправляет пользователю данные эмуляции.
                message.channel.send(`\`\`\`json\n${output}\`\`\``);
            } else {
                message.author.send(`${output}`, { split: '\n', code: 'js' });
            }
        } catch (error) {
            //Захватывает ошибку и говорит об этом.
            message.channel.send(`\`\`\`js\n${error}\`\`\``);
            //Ставит реакцию (Ошибка).
        }

        function clean(text) {
            return text
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203));
        }
    }
};