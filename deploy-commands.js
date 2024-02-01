const { REST, Routes } = require('discord.js');
const { log, warn, error } = require('./utils');
const fs = require('node:fs');
const path = require('node:path');
const { config } = require('dotenv');

config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (e) {
    error(e);
  }
})();