import 'dotenv/config';
import express from 'express';
import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 3000;

if (!token) {
  console.error('FATAL: DISCORD_TOKEN missing. Refusing to start.');
  process.exit(1);
}
