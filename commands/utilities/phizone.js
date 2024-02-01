const { SlashCommandBuilder } = require('discord.js');
const { error, recordToEmbed, chartToEmbed, songToEmbed } = require('../../utils');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('phizone')
    .setDescription('Provides utilities related to PhiZone.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('pb')
        .setDescription('Queries personal bests for a PhiZone user.')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('The ID of a PhiZone user.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('qs')
        .setDescription('Queries a song on PhiZone.')
        .addStringOption((option) =>
          option.setName('id').setDescription('The ID of a song.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('qc')
        .setDescription('Queries a chart on PhiZone.')
        .addStringOption((option) =>
          option.setName('id').setDescription('The ID of a chart.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ss')
        .setDescription('Searches songs on PhiZone.')
        .addStringOption((option) =>
          option.setName('query').setDescription('The string to search upon.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('sc')
        .setDescription('Searches charts on PhiZone.')
        .addStringOption((option) =>
          option.setName('query').setDescription('The string to search upon.'),
        ),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options._subcommand === 'pb') {
      const resp = await fetch(`${process.env.API_URL}/users/${interaction.options._hoistedOptions[0].value}/personalBests`);
      if (!resp.ok) {
        error(resp);
        await interaction.editReply(`An error occurred whilst retrieving personal bests.\n\`\`\`json\n${await resp.text()}\n\`\`\``);
        return;
      }
      const result = (await resp.json()).data;
      if (result.length === 0) {
        await interaction.editReply(`PhiZone user #${interaction.options._hoistedOptions[0].value} has an empty list of personal bests!`);
        return;
      }
      const best19 = result.best19.map((record, i) => recordToEmbed(record, `#${i + 1}`));
      await interaction.editReply({ content: `**Personal bests** (Phi 1 ~ Best 9) of PhiZone user #${interaction.options._hoistedOptions[0].value}`, embeds: [recordToEmbed(result.phi1, '#Phi'), ...best19.slice(0, 9)], ephemeral: true });
      await interaction.followUp({ content: `**Personal bests** (Best 10 ~ Best 19) of PhiZone user #${interaction.options._hoistedOptions[0].value}`, embeds: best19.slice(9), ephemeral: true });
    } else if (interaction.options._subcommand[1] === 'c') {
      const resp = await fetch(`${process.env.API_URL}/charts${interaction.options._subcommand[0] === 's' ? '?perPage=10&search=' : '/'}${interaction.options._hoistedOptions[0].value}`);
      if (!resp.ok && resp.status != 404) {
        error(resp);
        await interaction.editReply(`An error occurred during the query.\n\`\`\`json\n${await resp.text()}\n\`\`\``);
        return;
      }
      const result = (await resp.json()).data;
      if (!('length' in result) || result.length === 0) {
        await interaction.editReply('The query is empty!');
        return;
      }
      await interaction.editReply({ content: `**Chart query result${interaction.options._subcommand[0] === 's' ? `s** for ${interaction.options._hoistedOptions[0].value}` : '**'}`, embeds: 'map' in result ? result.map((chart) => chartToEmbed(chart)) : [chartToEmbed(result)], ephemeral: true });
    } else {
      const resp = await fetch(`${process.env.API_URL}/songs${interaction.options._subcommand[0] === 's' ? '?perPage=10&search=' : '/'}${interaction.options._hoistedOptions[0].value}`);
      if (!resp.ok) {
        error(resp);
        await interaction.editReply(`An error occurred during the query.\n\`\`\`json\n${await resp.text()}\n\`\`\``);
        return;
      }
      const result = (await resp.json()).data;
      if (!('length' in result) || result.length === 0) {
        await interaction.editReply('The query is empty!');
        return;
      }
      await interaction.editReply({ content: `**Song query result${interaction.options._subcommand[0] === 's' ? `s** for ${interaction.options._hoistedOptions[0].value}` : '**'}`, embeds: 'map' in result ? result.map((song) => songToEmbed(song)) : [songToEmbed(result)], ephemeral: true });
    }
  },
};
