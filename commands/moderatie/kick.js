// commands/moderatie/kick.js
export async function execute(interaction) {
  const user = interaction.options.getUser('Gebruiker');
  const member = await interaction.guild.members.fetch(user).catch(() => null);

  if (!member) {
    return interaction.reply({ content: 'Kan deze gebruiker niet vinden in de server.', ephemeral: true });
  }

  await member.kick(`Gekickt door ${interaction.user.tag}`);
  return interaction.reply({ content: `${user.tag} is gekickt.`, ephemeral: true });
}
