import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import mongoose from 'mongoose';
import UserXP from './models/UserXP.js';

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

const app = express();
const PORT = process.env.PORT || 3000;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // This one requires special permission!
  ],
});

import fetch from 'node-fetch'; // for ESM; if CommonJS: const fetch = require('node-fetch');

const activities = [
  { name: 'Koen', type: ActivityType.Listening },
  { name: 'createparadisemc.minecraft.best', type: ActivityType.Playing },
];

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  let index = 0;
  setInterval(() => {
    client.user.setActivity(activities[index]);
    index = (index + 1) % activities.length;
  }, 10_000); // every 10 seconds
});

const xpFile = './xpData.json';
let xpData = fs.existsSync(xpFile) ? JSON.parse(fs.readFileSync(xpFile)) : {};

function saveXP() {
  try {
    fs.writeFileSync('./xpData.json', JSON.stringify(xpData, null, 2));
    console.log('XP saved to file.');
  } catch (err) {
    console.error('Failed to write xpData.json:', err);
  }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const xpGain = Math.floor(Math.random() * 10) + 5;

  let user = await UserXP.findOne({ userId });
  if (!user) {
    user = new UserXP({ userId });
  }

  user.xp += xpGain;
  const nextLevelXP = user.level * 100;

  if (user.xp >= nextLevelXP) {
    user.level++;
    user.xp = 0;
    message.channel.send(`🎉 ${message.author} is nu level ${user.level}!`);
  }

  await user.save();

  if (message.content.startsWith('!level')) {
    message.channel.send(`${message.author.username} is level ${user.level} met ${user.xp} XP.`);
  }

  if (message.content.startsWith('!level')) {
  const user = message.mentions.users.first() || message.author;
  const data = xpData[user.id];
  if (data) {
    message.channel.send(`${user.username} is level ${data.level} met ${data.xp} XP.`);
  } else {
    message.channel.send(`${user.username} heeft nog geen XP.`);
  }
}

  // Only act on the specific channel
  if (message.channel.id !== '1374807938593591413' && message.channel.id !== '1382778106087079967') return;
  try {
    const response = await fetch('https://cp-webhook.vercel.app/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-api-key": process.env.API_KEY },
        body: JSON.stringify({
          content: message.content,
          username: message.author.username,
          avatar_url: message.author.displayAvatarURL({ format: 'png' })
        }),
      });

  await message.delete();
    
  if (!response.ok) {
    console.error('Failed to send webhook:', await response.text());
  } else {
    const data = await response.json();
    console.log('Webhook API response:', data);
  }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
});

// Helper function to split long messages nicely
function chunkMessage(message, maxLength = 2000) {
  const chunks = [];
  let start = 0;
  while (start < message.length) {
    let end = start + maxLength;

    // Try to break on a newline for nicer splits
    if (end < message.length) {
      const lastNewLine = message.lastIndexOf('\n', end);
      if (lastNewLine > start) {
        end = lastNewLine + 1;
      }
    }

    chunks.push(message.slice(start, end));
    start = end;
  }
  return chunks;
}

// Your interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Er ging iets mis bij het uitvoeren van dit commando.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Er ging iets mis bij het uitvoeren van dit commando.', ephemeral: true });
    }
  }
});




client.login(process.env.DISCORD_TOKEN);

// Basic web server to respond to pings
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
