const { Client, Collection, EmbedBuilder, GatewayIntentBits, WebhookClient } = require('discord.js')
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
client.makeLog = function (description, color = 0xc0c0c0, link = null) {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({ iconURL: this.user.displayAvatarURL(), name: `Khinzeniollog - ${Date.now()}`, url: link })
    .setDescription(description)
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
  client.hook.send({
    embeds: [
      client.makeLog(`${interaction.user} 使用 ${command.name} 指令`)
    ]
  })
}

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) ButtonInterationHandler(interaction)
  if (interaction.isChatInputCommand()) ChatInputCommandInterationHandler(interaction)
})

client.on('error', console.error)
process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

// Login
client.login(process.env.TOKEN)

