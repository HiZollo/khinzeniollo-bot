const { Client, Collection, GatewayIntentBits, WebhookClient } = require('discord.js')
require('dotenv').config()
const fs = require('node:fs')
const levelHandler = require('./levelHandler.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.hook = new WebhookClient({ id: '1244012602514739210', token: 'bNGUJi0d0g4w-YMvtov85R1FuFcYXrqOTczuxqS3upMALwsz7_SV2INr57amWyI1Cyi7'})
client.commands = new Collection()
client.energy = require('./energyManager.js')
client.cooldowns = require('./cooldownManager.js')
client.levelState = {
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  'E1': false,
  'E2': false,
}

// Load Commands
const commands = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'))

for (const commandPath of commands) {
  const command = require(`./commands/${commandPath}`)
  client.commands.set(command.name, command)
}

// Start the energy manager
client.energy.initialize()

// Listeners
client.once('ready', () => {
  console.log(`成功登入 ${client.user.tag}!`)
})

const replies = ['五週年活動將在 {} 開始', '我知道你很期待，但五週年活動還要 {}', '再等 {} 五週年活動就開始了', '你還有 {} 可以準備你的超級英雄裝備', '不知道今年的攻略組有誰', 'En una antigua España, hace mucho, mucho tiempo......', '{} 就可以開始探索歌聖的故事了', '如果對手是你們的話，會贏喔', '聽說這次活動會有 Nitro 和 Nitro Basic 作為獎勵，真是大手筆', '聽說這次的獎勵全看你們 {} 的表現', '那個抽獎規則有夠複雜，不知道你們搞懂了嗎', '請期待 {} 的活動', '你是準備好了所以才有空在這邊亂 ping 我嗎？', '聽說本次活動主題是西班牙文，但為什麼我卻講中文？', 'Preparativos en curso, por favor espere pacientemente', 'Faltan {} para el inicio del evento', 'Por favor, espere {} más, el evento está a punto de comenzar', 'Si eres enemigo, te venceré']

client.on('messageCreate', message => {
  if (message.mentions.has(process.env.ID)) {
    message.reply(replies[~~(Math.random() * replies.length)].replaceAll('{}', '<t:1717171200:R>'))
  }
})

function ButtonInterationHandler(interaction) {
  if (interaction.customId.startsWith('level_')) levelHandler.execute(interaction, interaction.client)
}

function ChatInputCommandInterationHandler(interaction) {
  const command = client.commands.find(command => command.name === interaction.commandName)

  if (!command) {
    return interaction.reply({
      content: '找不到這個指令，請稍等',
      ephemeral: true
    })
  }

  command.execute(interaction, client).catch(console.err)
}

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) ButtonInterationHandler(interaction)
  if (interaction.isChatInputCommand()) ChatInputCommandInterationHandler(interaction)
})

// Login
client.login(process.env.TOKEN)

