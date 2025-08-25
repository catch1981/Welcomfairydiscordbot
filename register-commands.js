import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN || '';
const clientId = process.env.CLIENT_ID || '';
const guildId = process.env.GUILD_ID || '';

const commands = [
  new SlashCommandBuilder().setName('welcome').setDescription('One-time welcome to Coven Zero'),
  new SlashCommandBuilder().setName('bless').setDescription('Bless this seeker'),
  new SlashCommandBuilder().setName('relic').setDescription('Drop a relic code'),
  new SlashCommandBuilder().setName('paths').setDescription('Explain the three paths'),
  new SlashCommandBuilder().setName('altar').setDescription('Acknowledge the altar flame'),
].map(c=> c.toJSON());

if (!token || !clientId){
  console.log('SAFE DEMO register: missing DISCORD_TOKEN or CLIENT_ID. Printing payload instead.');
  console.log(JSON.stringify(commands, null, 2));
  process.exit(0);
}

const rest = new REST({ version: '10' }).setToken(token);

try{
  const route = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
  const data = await rest.put(route, { body: commands });
  console.log(`Registered ${data.length} commands.`);
}catch(e){
  console.error(e);
}
