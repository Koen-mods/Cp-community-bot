import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'verbale-waarschuwing',
  description: 'Geef iemand een verbale waarschuwing',
};

export async function execute(interaction) {
  const reden = interaction.options.getString('reden');
  const embed = new EmbedBuilder()
    .setTitle('Waarschuwing!')
    .setDescription(`Een moderator heeft je gewaarschuwd voor ${reden}!\nAls je hiermee doorgaat kan je een zwaardere straf krijgen!`)
    .setColor(0x00AE86)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
