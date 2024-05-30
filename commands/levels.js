const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'levels',
  description: '活動關卡列表',
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(0xc0c0c0)
      .setTitle('選擇關卡')
      .setDescription('請選擇關卡進行挑戰\n\n挑戰之前，建議使用 </info:1245858480804593744> 指令了解答題注意事項，以免你找出了正確的答案卻被判錯\n\n當你開始挑戰後，體力將會被消耗一點\n\n**爾等按鈕者，當棄一切希望。**')

    const levels = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
              .setCustomId('level_1')
              .setLabel('1')
              .setStyle(levelButtonColor('1', client.levelState)),
          new ButtonBuilder()
              .setCustomId('level_2')
              .setLabel('2')
              .setStyle(levelButtonColor('2', client.levelState)),
          new ButtonBuilder()
              .setCustomId('level_3')
              .setLabel('3')
              .setStyle(levelButtonColor('3', client.levelState)),
          new ButtonBuilder()
              .setCustomId('level_4')
              .setLabel('4')
              .setStyle(levelButtonColor('4', client.levelState)),
          new ButtonBuilder()
              .setCustomId('level_5')
              .setLabel('5')
              .setStyle(levelButtonColor('5', client.levelState))
        )

    const boni = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('level_E1')
                .setLabel('Extra I')
                .setStyle(levelButtonColor('E1', client.levelState)),
            new ButtonBuilder()
                .setCustomId('level_E2')
                .setLabel('Extra II')
                .setStyle(levelButtonColor('E2', client.levelState))
        )

    await interaction.reply({ embeds: [embed], components: [levels, boni] })
  }
}

function levelButtonColor(levelId, ls) {
  return ls[levelId] 
    ? ButtonStyle.Secondary 
    : levelId.startsWith('E') ? ButtonStyle.Success : ButtonStyle.Primary
}
