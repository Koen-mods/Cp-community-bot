import { SlashCommandBuilder } from 'discord.js';

// Import subcommand logic
import { execute as banExecute } from './moderatie/ban.js';
import { execute as kickExecute } from './moderatie/kick.js';

export const data = new SlashCommandBuilder()
  .setName('moderatie')
  .setDescription("Moderatie commando's")
  .addSubcommand(subcommand =>
    subcommand
      .setName('ban')
      .setDescription('Ban iemand')
      .addUserOption(option =>
        option.setName('gebruiker').setDescription('Gebruiker om te bannen').setRequired(true))
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('kick')
      .setDescription('Kick iemand')
      .addUserOption(option =>
        option.setName('gebruiker').setDescription('Gebruiker om te kicken').setRequired(true))
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'ban') {
    await banExecute(interaction);
  } else if (subcommand === 'kick') {
    await kickExecute(interaction);
  } else {
    await interaction.reply({ content: 'Onbekend subcommando', ephemeral: true });
  }
}