const { Events } = require('discord.js');
const { error } = require('../utils');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (e) {
      error(e);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'An error occurred whilst executing the command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'An error occurred whilst executing the command!',
          ephemeral: true,
        });
      }
    }
  },
};
