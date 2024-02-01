const { Events } = require('discord.js');
const { log } = require('../utils');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    log(`Ready! Logged in as ${client.user.tag}.`);
  },
};
