import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';
import express from 'express';
import axios from 'axios';

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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

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

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'vraag') {
    const prompt = interaction.options.getString('prompt');

    await interaction.deferReply();

    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-Vision-Free',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        await interaction.editReply(data.choices[0].message.content);
      } else {
        console.error(data);
        await interaction.editReply('⚠️ No response from LLaMA.');
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply('⚠️ Error contacting Together.ai.');
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
