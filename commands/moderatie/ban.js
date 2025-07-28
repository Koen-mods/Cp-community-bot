export async function execute(interaction) {
  const user = interaction.options.getUser('Gebruiker');
  const member = await interaction.guild.members.fetch(user).catch(() => null);

  if (!interaction.member.permissions.has('BanMembers')) {
    const channel = client.channels.cache.get('1393239819806572737');
    if (channel && channel.isTextBased()) {
        channel.send(`${interaction.user.tag} heeft geprobeerd ${user.tag} te verbannen!`);
    }
    return interaction.reply({ content: 'Je hebt geen toestemming om dit commando te gebruiken!', ephemeral: true });
  }

  if (!member) {
    return interaction.reply({ content: 'Kan deze gebruiker niet vinden in de server.', ephemeral: true });
  }

  await member.ban({ reason: `Verbannen door ${interaction.user.tag}` });
  return interaction.reply({ content: `${user.tag} is verbannen. 🔨`, ephemeral: true });
}
