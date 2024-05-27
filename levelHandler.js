const problems = require('./problems.json')

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

module.exports = {
  async execute(interaction, client) {
    if (!client.energy.useEnergy()) {
      return interaction.reply({
        content: "噢不，你沒有體力了，所以無法挑戰。\n你可以使用 /stats 指令查看下次回復是什麼時候",
        ephemeral: true 
      })
    }
    
    await interaction.deferUpdate()

    const levelId = interaction.customId.slice(6) // level_
    await interaction.channel.send(`${interaction.user}，聽說你要挑戰${levelTranslate.zh[levelId]}，祝你好運`)
    
    await sleep(1000)

    await interaction.channel.send(`# ${levelTranslate.es[levelId]}. ${levelTranslate.name[levelId]}`)

    const passed = await levelStart(interaction, levelId, problems[levelId])

    await sleep(1000)

    // 沒過關
    if (!passed) {
      return interaction.channel.send(`${interaction.user} 挑戰失敗`)
    }

    // 標記過關和判斷首殺
    const firstBlood = !client.levelState[levelId]
    client.levelState[levelId] = true

    // 是首殺
    if (firstBlood) {
      await interaction.channel.send(`真是不敢相信，${interaction.user} 成功通過${levelTranslate.zh[levelId]}！`)
      await interaction.channel.send(`而且還是${levelTranslate.zh[levelId]}的首殺！趕快通知 <@&823241953012350977> 這項訊息來獲得你的豐厚獎勵！`)

      await sleep(500)
      interaction.client.energy.refillMaxEnergy()
      await interaction.channel.send('為了獎勵你們的努力，你們的體力已經被全部回滿')
      return
    }

    // 不是首殺
    await interaction.channel.send(`${interaction.user} 通過了 ${levelTranslate.zh[levelId]}，不過這關其實已經被解開過了，所以他算不算是浪費了一點體力 :thinking:`)

  }
}

async function levelStart(interaction, levelId, problems) {
  for await (const problem of problems) {
    if (problem.type === "problemset") {
      // 打亂問題集
      const arr = structuredClone(problem.problems)
      shuffleArray(arr)
      // 遞迴
      const passed = await levelStart(interaction, levelId, arr)
      if (!passed) return false
    }

    if (problem.type === "problem") {
      const correct = await challenge(interaction, problem.question, problem.answers)
      if (!correct) return false
    }
  }

  return true

}

async function challenge(interaction, question, answers) {
  console.log(question, answers)
  await interaction.channel.send(question)
  const collected = await interaction.channel.awaitMessages({
    filter: m => m.author.id === interaction.user.id,
    time: 10e3,
    max: 1
  })
  
  // 超時
  if (!collected.size) {
    interaction.channel.send("已經超過一分鐘了，等你準備好再來找我好不好？我在此終止你的挑戰")
    return false
  }

  const message = collected.first()

  const correct = answers.includes(message.content)
  await message.delete().catch(() => {})

  if (!correct) {
    interaction.channel.send("你的答案似乎是錯誤的，請再接再厲")
    return false
  }

  return true
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const levelTranslate = {
  zh: {
    '1': '第一關',
    '2': '第二關',
    '3': '第三關',
    '4': '第四關',
    '5': '第五關',
    'E1': '獎勵一',
    'E2': '獎勵二',
  },

  es: {
    '1': 'Uno',
    '2': 'Dos',
    '3': 'Tres',
    '4': 'Cuatro',
    '5': 'Cinco',
    'E1': 'Extra I',
    'E2': 'Extra II',
  }, 

  name: {
    '1': '¿Qué cosa hay aquí?',
    '2': 'Rosetta',
    '3': '¿Cómo cantar?',
    '4': '¿Dónde están?',
    '5': '¿Cuánto?',
    'E1': '¿Cuál es?',
    'E2': '¿Quién es?',
  }
}
