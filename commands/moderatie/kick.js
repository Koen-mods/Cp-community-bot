// commands/moderatie/kick.js
export async function execute(interaction) {
  const user = interaction.options.getUser('Gebruiker');
  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member) {
    return interaction.reply({ content: 'Kan deze gebruiker niet vinden in de server.', ephemeral: true });
  }

  if (!member.kickable) {
    return interaction.reply({ content: 'Ik kan deze gebruiker niet kicken (misschien heeft deze een hogere rol?).', ephemeral: true });
  }

  await member.kick(`Gekickt door ${interaction.user.tag}`);
  return interaction.reply({ content: `${user.tag} is gekickt.`, ephemeral: true });
}
