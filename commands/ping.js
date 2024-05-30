module.exports = {
  name: 'ping',
  description: 'Ping!',
  async execute(interaction, client) {
    await interaction.deferReply()
    const message = await interaction.editReply('計算中……')
    const ping = message.createdTimestamp - interaction.createdTimestamp
    await message.edit(`:information_source:｜Pong！機器人延遲為：${ping}ms，API 延遲為：${client.ws.ping}ms`)
  }
}
