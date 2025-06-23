export const data = {
  name: 'spam',
  description: 'Spam een prachtige zin in de chat xD',
};

export async function execute(interaction) {
  const allowedRoleId = ''; // Vervang dit door de juiste rol ID

  const allowedRoles = ['1353284416620859462', '1386718540358221844']; // Replace with your actual role IDs

  const hasRole = allowedRoles.some(roleId => interaction.member.roles.cache.has(roleId));

  if (!hasRole) {
  return interaction.reply({ content: 'Je hebt niet de juiste rol om dit commando te gebruiken.', ephemeral: true });
  }

  await interaction.reply('Help, let me go!');
  // Hier komt de logica van je commando
  for (let i = 0; i < 1000; i++){
    await interaction.followUp('Help, let me go!');
  }
}
