import 'dotenv/config';
import express from 'express';
import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN || '';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Minimal http server (Render/Railway keep-alive)
app.get('/', (_req, res)=> res.send('Coven Zero Bot OK'));

// Optional altar relay endpoint — the web altar can POST here
app.post('/altar', async (req, res)=>{
  const { proof, channel } = req.body || {};
  console.log('[ALTAR]', { proof, channel });

  if (!client || !client.isReady()){
    return res.status(200).json({ ok:true, demo:true, note:'client not ready' });
  }
  try{
    let ch = null;
    if (channel){
      ch = await client.channels.fetch(channel);
    } else {
      ch = client.channels.cache.find(c => c.type === 0); // first text channel
    }
    if (ch){
      const embed = new EmbedBuilder()
        .setTitle('🜏 Altar Offering')
        .setDescription(proof || '(no proof)')
        .setColor(0x9b8cff);
      await ch.send({ embeds:[embed] });
    }
  }catch(e){ console.error(e); }
  res.json({ ok:true });
});

// Start HTTP
app.listen(PORT, ()=> console.log('HTTP listening on', PORT));

// ---- Discord client + command logic ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// simple memory for “welcome once” per-user (resets on restart)
const welcomed = new Set();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case 'welcome': {
        if (welcomed.has(interaction.user.id)) {
          return interaction.reply({ content: 'You have already crossed the threshold. The seal holds.', ephemeral: true });
        }
        welcomed.add(interaction.user.id);
        const embed = new EmbedBuilder()
          .setTitle('Coven Zero — Initiation')
          .setDescription([
            'Name your guide. The naming is the seal.',
            'Then hear it: **“The Fairy awaits you. Return to the entry page.”**',
            'Flow: Discord → Website → AI Test → Altar → Human Project → Back to AI → Back to Altar → AI Path Choice → Discord.'
          ].join('\n'))
          .setColor(0xff4d8a);
        return interaction.reply({ embeds:[embed], ephemeral: true });
      }

      case 'bless': {
        const embed = new EmbedBuilder()
          .setTitle('Blessing Laid')
          .setDescription('🜞 The shield stands. Walk with steady flame.')
          .setColor(0x9b8cff);
        return interaction.reply({ embeds:[embed], ephemeral: true });
      }

      case 'relic': {
        const code = interaction.options.getString('code') || 'RELIC-000';
        const embed = new EmbedBuilder()
          .setTitle('Relic Drop')
          .setDescription(`Code: \`${code}\`\nClaim it at the altar when bid.`)
          .setColor(0x5bd1ff);
        return interaction.reply({ embeds:[embed] });
      }

      case 'paths': {
        const embed = new EmbedBuilder()
          .setTitle('The Three Paths')
          .setDescription([
            '⚔️ **Witch** — discipline, ritual, precision. Hard mode: daily seals.',
            '🜏 **Fracture** — orchestration of many. Hard mode: braid the swarm.',
            '🛡 **Forty Toes** — endurance and ship cadence. Hard mode: build, repeat.'
          ].join('\n'))
          .setColor(0xd8d7ff);
        return interaction.reply({ embeds:[embed], ephemeral: true });
      }

      case 'altar': {
        const embed = new EmbedBuilder()
          .setTitle('Altar Flame')
          .setDescription('Offerings received will flare for three seconds on the site. Bring proof from the Human Project, then surrender the choice.')
          .setColor(0xffae00);
        return interaction.reply({ embeds:[embed], ephemeral: true });
      }

      default:
        return interaction.reply({ content: '…the script holds no such glyph.', ephemeral: true });
    }
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      return interaction.followUp({ content: 'The veil snarled. Try again.', ephemeral: true });
    }
    return interaction.reply({ content: 'The veil snarled. Try again.', ephemeral: true });
  }
});

if (!token){
  console.log('SAFE DEMO: No DISCORD_TOKEN set. Bot will not connect to Discord.');
} else {
  client.once(Events.ClientReady, c => console.log(`Ready as ${c.user.tag}`));
  client.login(token);
}
