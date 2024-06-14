const problems = require('./problems.json')

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

module.exports = {
  async execute(interaction, client) {
    const levelId = interaction.customId.slice(6) // level_

    // Check Cooldown
    const endTime = client.cooldowns.checkUser(interaction.user.id)
    if (endTime > 0) {
      return interaction.reply({
        content: `噢不，你還在冷卻期間，所以無法挑戰\n請稍候 ${msToText(endTime)}後再重新開啟你的挑戰`,
        ephemeral: true
      })
    }

    // Check Energy
    if (!client.energy.useEnergy()) {
      return interaction.reply({
        content: "噢不，你沒有體力了，所以無法挑戰\n你可以使用 </stats:1245858480804593747> 指令查看下次回復是什麼時候",
        ephemeral: true 
      })
    }
    
    // Prepare
    await interaction.deferUpdate()
    client.cooldowns.addUser(interaction.user.id)

    // Log
    const logMessage = await client.hook.send({
      embeds: [client.makeLog(`${interaction.user} 開始挑戰${levelTranslate.zh[levelId]}`, 0x4A4EDC)]
    })

    await interaction.channel.send(`${interaction.user}，聽說你要挑戰${levelTranslate.zh[levelId]}，祝你好運`)
    
    await sleep(1000)

    // Start
    await interaction.channel.send(`# ${levelTranslate.es[levelId]}. ${levelTranslate.name[levelId]}`)

    const passed = await levelStart(interaction, levelId, problems[levelId])

    await sleep(1000)

    // 沒過關
    if (!passed) {
      await client.hook.send({
        embeds: [client.makeLog(`${interaction.user} 挑戰${levelTranslate.zh[levelId]}失敗`, 0xE93A3A, makeLogMessageURL(logMessage))]
      })
      return interaction.channel.send(`${interaction.user} 挑戰失敗`)
    }

    // 標記過關和判斷首殺
    const firstBlood = !client.levelState[levelId]
    client.levelState[levelId] = true

    // 是首殺
    if (firstBlood) {
      await client.hook.send({
        embeds: [client.makeLog(`${interaction.user} 成功首殺${levelTranslate.zh[levelId]}`, 0x00BF4C, makeLogMessageURL(logMessage))]
      })

      await interaction.channel.send(`真是不敢相信，${interaction.user} 成功通過${levelTranslate.zh[levelId]}！`)
      await interaction.channel.send({ 
        content: `而且還是${levelTranslate.zh[levelId]}的首殺！趕快通知 <@&823241953012350977> 這項訊息來獲得你的豐厚獎勵！`,
        allowedMentions: { parse: ['roles'] }
      })

      await sleep(500)
      interaction.client.energy.refillMaxEnergy()
      interaction.client.cooldowns.amnesty()
      await interaction.channel.send('為了獎勵你們的努力，你們的體力已經被全部回滿，且所有人的冷卻時間通通重置')
      
      const main_all_pass = client.levelState['1'] && client.levelState['2'] && client.levelState['3'] && client.levelState['4'] && client.levelState['5']
      const all_pass = main_all_pass && client.levelState['E1'] && client.levelState['E2']

      if (all_pass) {
        await interaction.channel.send(`活動的七關已被全數攻略，HiZollo 五週年活動在此結束\n現在時間：<t:${~~(Date.now() / 1000)}:f>`)
      } else if (main_all_pass && levelId !== 'E1' && levelId !== 'E2') {
        await interaction.channel.send(`活動的五個主要關卡已被全數攻略，將會發放 HiZollo 五週年全破獎勵\n現在時間：<t:${~~(Date.now() / 1000)}:f>，活動結束前可繼續挑戰獎勵關卡`)
      }
      
      return
    }

    // 不是首殺
    await interaction.channel.send(`${interaction.user} 通過了 ${levelTranslate.zh[levelId]}，不過這關其實已經被解開過了，所以他算不算是浪費了一點體力 :thinking:`)
    await client.hook.send({
      embeds: [client.makeLog(`${interaction.user} 再次通過${levelTranslate.zh[levelId]}`, 0xF2D049, makeLogMessageURL(logMessage))]
    })

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

    if (problem.type === "problem-multi") {
      const correct = await challengeMulti(interaction, problem.question, problem.answers)
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
    time: 60e3,
    max: 1
  })
  
  // 超時
  if (!collected.size) {
    interaction.channel.send("已經超過一分鐘了，等你準備好再來找我好不好？我在此終止你的挑戰")
    return false
  }

  const message = collected.first()

  const correct = answers.includes(message.content)
  // await message.delete().catch(() => {})

  if (!correct) {
    interaction.channel.send(`${message.content} 似乎是錯誤的答案，請再接再厲`)
    return false
  }

  return true
}

async function challengeMulti(interaction, question, answers) {
  console.log(question, answers)
  await interaction.channel.send(question)
  const collected = await interaction.channel.awaitMessages({
    filter: m => m.author.id === interaction.user.id,
    time: 60e3,
    max: 1
  })
  
  // 超時
  if (!collected.size) {
    interaction.channel.send("已經超過一分鐘了，等你準備好再來找我好不好？我在此終止你的挑戰")
    return false
  }

  const message = collected.first()

  const responses = message.content.split(/\n+/)
  // await message.delete().catch(() => {})

  if (responses.length !== answers.length) {
    interaction.channel.send(`${responses.join('、')} 似乎是錯誤的答案，請再接再厲`)
    return false
  }

  const correct = answers.every(ans => ans.some(a => responses.includes(a)))
  if (!correct) {
    interaction.channel.send(`${responses.join('、')} 似乎是錯誤的答案，請再接再厲`)
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

function msToText(ms) {
  const a = ~~(ms/1000)
  const min = ~~(a/60)
  const s = a % 60

  if (min > 0) return `${min} 分 ${s} 秒`
  return `${s} 秒`
}

function makeLogMessageURL({ channel_id, id }) {
  return `https://discord.com/channels/572733182412193792/${channel_id}/${id}`
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
