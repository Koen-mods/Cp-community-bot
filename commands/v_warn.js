import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('verbale waarschuwing')
  .setDescription('Geef iemand een verbale waarschuwing')
  .addStringOption(option =>
    option
      .setName('reden')
      .setDescription('Reden voor waarschuwing')
      .setRequired(true)
  );

const reden = interaction.options.getString('reden');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('Waarschuwing!')
    .setDescription(`Een moderator heeft je gewaarschuwd voor ${reden}!\nAls je hiermee doorgaat kan je een zwaardere straf krijgen!`)
    .setColor(0x00AE86)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
