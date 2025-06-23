import { SlashCommandBuilder } from 'discord.js';

export async function execute(interaction) {
  const reden = interaction.options.getString('reden');
  const embed = new EmbedBuilder()
    .setTitle('Waarschuwing!')
    .setDescription(`Een moderator heeft je gewaarschuwd voor ${reden}!\nAls je hiermee doorgaat kan je een zwaardere straf krijgen!`)
    .setColor(0x00AE86)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
