module.exports = {
  name: 'ping',
  description: 'Ping!',
  async execute(interaction, client) {
    if (client.energy.useEnergy()) {
      await interaction.reply(`Pong! Energy remaining: ${client.energy.getEnergy()}/${client.energy.maxEnergy}`)
    } else {
      await interaction.reply('No energy left. Please wait for it to refill.')
    }
  }
}
