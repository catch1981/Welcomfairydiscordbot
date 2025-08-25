import express from "express";
import fetch from "node-fetch";
import { verifyKeyMiddleware } from "discord-interactions";

const app = express();

// ---- CONFIG ----
const SITE_URL            = process.env.SITE_URL || "https://catch1981.github.io";
const DISCORD_URL         = process.env.DISCORD_URL;        // webhook (for site -> Discord)
const DISCORD_PUBLIC_KEY  = process.env.DISCORD_PUBLIC_KEY; // app public key
const DISCORD_APP_ID      = process.env.DISCORD_APP_ID;     // app ID
const DISCORD_BOT_TOKEN   = process.env.DISCORD_BOT_TOKEN;  // bot token (reset it!)
const REGISTER_SECRET     = process.env.REGISTER_SECRET || "coven123";

// Optional: deep-link channels you gave me
const GUILD_ID      = "1387751793496297522";
const WELCOME_CH_ID = "1387751793496297528";
const ALTAR_CH_ID   = "1408339354862096446";
const chWeb = cid => `https://discord.com/channels/${GUILD_ID}/${cid}`;
const chApp = cid => `discord://-/channels/${GUILD_ID}/${cid}`;

app.get("/", (_,res)=>res.send("ok"));

// ---- RELAY (Site -> Discord webhook) ----
app.options("/relay", (_,res)=>res.set({
  "Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"content-type"
}).send());

app.use("/relay", express.json());
app.post("/relay", async (req,res)=>{
  try{
    const r = await fetch(DISCORD_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(req.body)});
    const txt = await r.text();
    res.set("Access-Control-Allow-Origin","*");
    res.status(r.status).send(txt || "forwarded");
  }catch(e){
    res.set("Access-Control-Allow-Origin","*");
    res.status(500).send("relay_error:"+e.message);
  }
});

// ---- INTERACTIONS (Slash commands -> link back) ----
// IMPORTANT: raw body before verify
app.post("/interactions",
  express.raw({ type:"application/json" }),
  verifyKeyMiddleware(DISCORD_PUBLIC_KEY),
  async (req,res)=>{
    const i = JSON.parse(req.body.toString("utf8"));

    // PING
    if(i.type === 1) return res.json({ type:1 });

    // APPLICATION_COMMAND
    if(i.type === 2){
      const cmd = i.data?.name || "begin";
      let label="Enter the Veil", url=SITE_URL, ch=WELCOME_CH_ID;

      switch(cmd){
        case "welcome": case "begin": label="Return to Welcome"; url=`${SITE_URL}/index.html`;        ch=WELCOME_CH_ID; break;
        case "instructions":          label="First Sacrifice";   url=`${SITE_URL}/instructions.html`; ch=WELCOME_CH_ID; break;
        case "test":                  label="Second Sacrifice";  url=`${SITE_URL}/test.html`;         ch=ALTAR_CH_ID;   break;
        case "altar": default:        label="The Altar";         url=`${SITE_URL}/altar.html`;        ch=ALTAR_CH_ID;   break;
      }

      return res.json({
        type: 4,
        data: {
          content: "🌑 The path opens. Step through:",
          components: [
            { type:1, components:[ { type:2, style:5, label, url } ] },
            { type:1, components:[
                { type:2, style:5, label:"Open Channel (App)", url: chApp(ch) },
                { type:2, style:5, label:"Open Channel (Web)", url: chWeb(ch) }
            ]}
          ]
        }
      });
    }

    return res.json({ type:4, data:{ content:"✨ The veil stirs, but I heard no command." } });
  }
);

// ---- REGISTER (run once to publish commands) ----
app.get("/register", async (req,res)=>{
  try{
    if(REGISTER_SECRET && req.query.secret !== REGISTER_SECRET) return res.status(401).send("unauthorized");
    const commands = [
      { name:"begin",        description:"Return to the Entry (Welcome)" },
      { name:"welcome",      description:"Return to the Entry (Welcome)" },
      { name:"instructions", description:"Open the Scroll (First Sacrifice)" },
      { name:"test",         description:"Enter the Human Project (Second Sacrifice)" },
      { name:"altar",        description:"Return to the Altar (Third Sacrifice)" }
    ];
    const r = await fetch(`https://discord.com/api/v10/applications/${DISCORD_APP_ID}/commands`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json","Authorization":`Bot ${DISCORD_BOT_TOKEN}` },
      body: JSON.stringify(commands)
    });
    const txt = await r.text();
    return res.status(r.status).send(txt);
  }catch(e){ return res.status(500).send("register_error:"+e.message); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Coven relay + commands on", PORT));
