const { EmbedBuilder } = require('discord.js')
module.exports = {
  name: 'info',
  description: '取得活動說明書',
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xc0c0c0)
      .setTitle('活動作答說明書')
      .setDescription(text)

    await interaction.reply({ embeds: [embed] })
  }
}

const text = 
  '歡迎遊玩 Khinzeniollo: HiZollo 五週年活動。\n' +
  '在參與活動前，應先閱讀活動公告及本說明書，否則後果自負。\n' +
  '\n' +
  '請在網站上閱讀題目，並到 <#1244596817174462564> 進行討論。當準備好答題後，使用 /levels 選擇你要的關卡進行回答。\n' +
  '機器人輸出的所有題目都是使用中文進行書寫。當你進入作答模式後，每題只有一分鐘的時間回答。當你完成一次作答後，要等 90 分鐘才能再次作答。每關都有一題以上的題目，且題目的順序有可能會隨機更動。當你回答完一題後，才會輸出下一題。\n' +
  '為了避免程式對你的回答做出錯誤的判斷，導致浪費體力，回答時請注意以下幾點：\n' +
  '- 如果回答的是題目給你的代碼，請直接原封不動附上代碼（類似四週年活動）\n' +
  '- 如果回答的是數字，請使用阿拉伯數字以十進位撰寫\n' +
  '- 如果回答的是日期，請使用 YYYY/MM/DD 回答，要補零。如果是西元前請在最前方加上 BC。若題目沒有問年份則使用 MM/DD。\n' +
  '  - 例如 01/01、1991/12/31、BC100/04/20\n' +
  '- 如果回答的是題目中的文本，請附上一模一樣的文本。\n' +
  '  - 例如題目文本是「His name is Hserkcol Okarecl Meeleretrac Ompaqqlvs, the legendary name after god.」，要你回答他的名字，請你回答 Hserkcol Okarecl Meeleretrac Ompaqqlvs\n' +
  '- 如果回答的是外文單字，請以[英文維基辭典](<https://en.wiktionary.org>)中的拼寫方法為準（大多數都是全部小寫啦）。\n' +
  '- 如果以上都不是，那麼以這個東西在**英文維基百科**的頁面標題為準（包含大小寫及特殊字符）\n' +
  '  - 例如答案是「西班牙文」，請你回答「Spanish language」，因為這是西班牙文在英文維基百科頁面的標題。\n' +
  '- 如果有多個答案，每個答案請以換行分隔（也就是一行寫一個答案）。\n' +
  '- 若題目有特別要求，會明確寫在題目上，請按照題目要求。\n' +
  '- 即使你沒按照以上要求回答，仍然可能是正確的答案（因為開發者很善良），但是我們不保證所有你想得到的表示法都會被登錄為正確答案，按照以上作答標準是最安全的。\n' +
  '\n' +
  '以上為標準作答守則。若你想知道活動當下的各種資訊，可以使用 /stats 指令觀看。\n'
