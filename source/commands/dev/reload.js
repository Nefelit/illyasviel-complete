module.exports = {
  name: "reload",
  description: 'Команда для разработчиков',
  execute: async function(message, args) {
    let manager = require('../../../index');
    if(args[0] === 'commands') {
      client.commands.clear();
      let msg = await message.channel.send(`Выгрузка команд: успешно`);
      manager.loadCommands().then(r => {
        msg.edit('Команды подгружены!');
      })
    }
  }
}