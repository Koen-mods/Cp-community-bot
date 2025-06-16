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

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'vraag') {
    const prompt = interaction.options.getString('prompt');
    await interaction.deferReply(); // Prevent timeout

    const llamaPrompt = `### Instruction:\n${prompt}\n\n### Response:`;

    try {
      const res = await axios.post(
        'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
        {
          inputs: llamaPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`
          }
        }
      );

      console.log("Hugging Face response:", res.data);

      const fullResponse = res.data?.[0]?.generated_text || "No response.";
      const reply = fullResponse.split("### Response:")[1]?.trim() || fullResponse;

      await interaction.editReply(reply.slice(0, 2000));

    } catch (err) {
      console.error("Hugging Face API error:", err?.response?.data || err.message);
      await interaction.editReply("❌ Error getting response from LLaMA.");
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
