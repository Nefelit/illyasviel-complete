const fetch = require('request-promise')

module.exports = {
    name: 'discover',
    description: "Подбирает вам треки по учету ваших предпочтений<br><b>НА ТЕХ РАБОТАХ</b>",
    async execute(message, args) {
        return message.channel.send('В разработке.');

        const options = {
            method: 'POST',
            uri: `https://api.ksoft.si/music/recommendations`,
            json: true,
            body: {},
            headers: {
                'Authorization': config.ksoft_service
            }
        };
        let data = await fetch(options);
        console.log(data)
    }
}