export const data = {
  name: 'vraag',
  description: 'Vraag LLaMA iets',
  options: [
    {
      type: 3, // STRING
      name: 'prompt',
      description: 'Wat wil je vragen aan LLaMA?',
      required: true,
    },
  ],
};

export async function execute(interaction) {
  await interaction.deferReply();
  const prompt = interaction.options.getString('prompt');

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-Vision-Free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return await interaction.editReply(`API error: ${errorText}`);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content;

    if (!replyText || typeof replyText !== 'string') {
      return await interaction.editReply('⚠️ No valid response from AI.');
    }

    const chunks = chunkMessage(replyText);

    for (let i = 0; i < chunks.length; i++) {
      if (i === 0) {
        await interaction.editReply(chunks[i]);
      } else {
        await interaction.followUp(chunks[i]);
      }
    }

  } catch (err) {
    console.error(err);
    await interaction.editReply('⚠️ Error contacting AI service.');
  }
}
