import 'dotenv/config';
import express from 'express';
import { Client, GatewayIntentBits, Events } from 'discord.js';

const token = process.env.DISCORD_TOKEN || '';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', (_req, res)=> res.send('Coven Zero Bot OK'));

// Optional altar relay endpoint to receive offerings from site
app.post('/altar', async (req, res)=>{
  const { proof, channel } = req.body || {};
  console.log('[ALTAR]', { proof, channel });
  if (!client || !client.isReady()){
    return res.status(200).json({ok:true, demo:true, note:'client not ready'});
  }
  try{
    let ch = null;
    if (channel){
      ch = await client.channels.fetch(channel);
    } else {
      ch = client.channels.cache.find(c => c.type === 0); // first text channel
    }
    if (ch){
      await ch.send(`🜏 **Altar Offering**\n${proof||'(no proof)'}`);
    }
  }catch(e){ console.error(e); }
  res.json({ok:true});
});

app.listen(PORT, ()=> console.log('HTTP listening on', PORT));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (!token){
  console.log('SAFE DEMO: No DISCORD_TOKEN set. Bot will not connect to Discord.');
} else {
  client.once(Events.ClientReady, c => console.log(`Ready as ${c.user.tag}`));
  client.login(token);
}
