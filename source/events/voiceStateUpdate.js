module.exports = async (old, state) => {
    if (!old.channelID) return;
    if (client.player.getPlayer(state.guild.id)) {
        let room = state.guild.channels.cache.get(old.channelID);
        if (!room.members.has(client.user.id)) return;
        if (!room.members || (room.members && room.members.filter(x => !x.user.bot).size <= 0)) {

            if (
                client.player.queue.get(state.guild.id)
                && client.player.queue.get(state.guild.id).bound
            ) {
                if (client.player.queue.get(state.guild.id).lastUserLeave)
                    client.channels.cache.get(client.player.queue.get(state.guild.id).bound).messages.fetch(client.player.queue.get(state.guild.id).lastUserLeave).then(msg => msg.delete())
                let msg = await client.channels.cache.get(client.player.queue.get(state.guild.id).bound).send(`#️⃣ **Последний пользователь покинул канал**, через 1 минуту мне тоже придется покинуть канал!`)

                setTimeout(() => {
                    try {
                        if (!room.members || (room.members && room.members.filter(x => !x.user.bot).size <= 0)) {
                            msg.delete()
                            client.player.getPlayer(room.guild.id).disconnect()
                            client.player.queue.delete(room.guild.id)
                        }
                    } catch (err) { console.log('Ошибка..') }
                }, 60000)
            }
        }
    }
}
