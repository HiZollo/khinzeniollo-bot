const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'stats',
  description: '顯示目前活動狀態',
  async execute(interaction, client) {
    const energy = client.energy.getEnergy()
    const maxEnergy = client.energy.maxEnergy
    const nextRefillTime = ~~(client.energy.getNextRefillTime() / 1e3)
    const nextRefillTimestamp = client.energy.getNextRefillTimestamp()

    const nextRefillMessage = nextRefillTime
      ? '\`' + `${~~(nextRefillTime / 60)}`.padStart(2, '0') + ':' + `${nextRefillTime % 60}`.padStart(2, '0') + '\`'
      : '\`--:--\`'

    const endTime = client.cooldowns.checkUser(interaction.user.id)

    const embed = new EmbedBuilder()
      .setColor(0xc0c0c0)
      .setTitle('活動狀態')
      .setDescription(`:zap:  ${energy}/${maxEnergy}    ${nextRefillMessage}`)

    embed.setFields({
      name: '破關狀態', 
      value: Object.entries(client.levelState).map(obj => `\`${levelName[obj[0]].padEnd(8, ' ')}\`: ${obj[1] ? ':white_check_mark:' : ':x:'}`).join('\n')
    }, {
      name: '個人狀態',
      value: `冷卻中：${endTime > 0 ? `直到 <t:${~~((Date.now() + endTime)/1000)}:T>` : '否'}`
    })

    await interaction.reply({ embeds: [embed] })
  }
}

const levelName = {
  '1': 'Uno',
  '2': 'Dos',
  '3': 'Tres',
  '4': 'Cuatro',
  '5': 'Cinco',
  'E1': 'Extra I',
  'E2': 'Extra II'
}
