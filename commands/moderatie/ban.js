export async function execute(interaction) {
    const { client, options, guild, member: moderator } = interaction;
    const user = options.getUser('Gebruiker');
    
    // Check permissions
    if (!moderator.permissions.has(PermissionFlagsBits.BanMembers)) {
        const channel = client.channels.cache.get('1393239819806572737');
        if (channel?.isTextBased()) {
            await channel.send(`${moderator.user.tag} heeft geprobeerd ${user.tag} te verbannen!`);
        }
        return interaction.reply({ 
            content: 'Je hebt geen toestemming om dit commando te gebruiken!', 
            ephemeral: true 
        });
    }

    try {
        // Fetch the member (use fetchBan if user not in server)
        const member = await guild.members.fetch(user.id).catch(() => null);
        
        if (!member) {
            // User might not be in server, try banning directly
            await guild.bans.create(user, { 
                reason: `Verbannen door ${moderator.user.tag}` 
            });
            return interaction.reply({ 
                content: `${user.tag} is verbannen (was niet in server). 🔨`, 
                ephemeral: true 
            });
        }
        // Ban the member
        await member.ban({ 
            reason: `Verbannen door ${moderator.user.tag}` 
        });
        
        return interaction.reply({ 
            content: `${user.tag} is verbannen. 🔨`, 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Ban error:', error);
        return interaction.reply({ 
            content: 'Er ging iets mis tijdens het verbannen van deze gebruiker.', 
            ephemeral: true 
        });
    }
}
