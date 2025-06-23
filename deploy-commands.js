
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const commands = [
  new SlashCommandBuilder()
    .setName('vraag')
    .setDescription('Vraag LLaMA iets')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Wat wil je vragen aan LLaMA?')
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Spam een prachtige zin in de chat xD')
    .toJSON(),
  new SlashCommandBuilder()
  .setName('verbale waarschuwing')
  .setDescription('Geef iemand een verbale waarschuwing')
  .addStringOption(option =>
    option
      .setName('reden')
      .setDescription('Reden voor waarschuwing')
      .setRequired(true)
  )
  .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Command registered.');
  } catch (err) {
    console.error('Failed to register command:', err);
  }
})();
