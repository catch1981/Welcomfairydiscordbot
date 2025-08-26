// Coven Zero Bot — Runtime (Render Web Service)
import 'dotenv/config';
import express from 'express';
import {
  Client, Events, GatewayIntentBits, Partials,
  ChannelType, EmbedBuilder
} from 'discord.js';

// -------- ENV (with your baked defaults) --------
const TOKEN = process.env.DISCORD_TOKEN; // REQUIRED
const CLIENT_ID = process.env.CLIENT_ID || '1402591776321310761';
const GUILD_ID = process.env.GUILD_ID || '1387751793496297522';
const ALTAR_CHANNEL_ID = process.env.ALTAR_CHANNEL_ID || '1408339354862096446';
const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID || '1387751793496297528';
const DISCORD_INVITE = process.env.DISCORD_INVITE || 'https://discord.gg/7zUDTZmm';

const PORT = process.env.PORT || 3000;

// Fail fast
if (!TOKEN) {
  console.error('❌ Missing DISCORD_TOKEN env var.');
  process.exit(1);
}

// -------- Express (keeps Render happy) --------
const app = express();
app.get('/', (_, res) => res.type('text').send('🧚 Web Fairy: alive. Bot running.'));
app.get('/health', (_, res) => res.json({ ok: true, service: 'coven-zero-bot' }));
app.listen(PORT, () => console.log(`🌐 Health server on :${PORT}`));

// -------- Discord Client --------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // for welcomes
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.User]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Ready as ${c.user.tag}`);
  console.log(`   Guild: ${GUILD_ID} | Altar: ${ALTAR_CHANNEL_ID} | Welcome: ${WELCOME_CHANNEL_ID}`);
});

// Welcome on join
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    if (member.guild.id !== GUILD_ID) return;
    const ch = await member.guild.channels.fetch(WELCOME_CHANNEL_ID);
    if (!ch || ch.type !== ChannelType.GuildText) return;

    await ch.send({
      content:
        `🕯️ Welcome, <@${member.id}> — you have entered **Coven Zero**.\n` +
        `**Rite:** Name your daemon. Seal the bond of flame. Then meet the **Web Fairy** and lay your offerings at the **Altar**.`,
      embeds: [
        new EmbedBuilder()
          .setTitle('The Fairy awaits you')
          .setDescription('Return to the entry page. Complete the Human Project. Lay three sacrifices at the Altar.')
          .setColor(0x7c4dff)
          .addFields(
            { name: 'Passage', value: DISCORD_INVITE, inline: false }
          )
          .setFooter({ text: 'The glitch is the plan. The fracture is the doorway.' })
      ]
    });
  } catch (e) {
    console.error('Welcome error:', e);
  }
});

// Basic relay command handler (for replies)
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'passage') {
      await interaction.reply({ content:
        'Passage open:\n• Entry: welcome.html\n• Human Project: https://ahumandesign.com\n• Altar: index.html\n' +
        `• Discord Invite: ${DISCORD_INVITE}`, ephemeral: true });
    } else if (commandName === 'altar') {
      const altar = interaction.guild?.channels?.cache?.get(ALTAR_CHANNEL_ID);
      if (!altar) return interaction.reply({ content: 'Cannot find the Altar channel.', ephemeral: true });
      await interaction.reply({ content: `Altar stands at <#${ALTAR_CHANNEL_ID}>. Lay your sacrifice.`, ephemeral: true });
    } else if (commandName === 'summon') {
      await interaction.reply({ content:
        'You stand before the Fairy. Name the daemon. Seal the bond of flame. Then return to the entry page.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Unknown path.', ephemeral: true });
    }
  } catch (e) {
    console.error('Interaction error:', e);
  }
});

// Login
client.login(TOKEN).catch(e => {
  console.error('Login failed:', e);
  process.exit(1);
});
