import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/relay", async (req, res) => {
  try {
    const r = await fetch(process.env.DISCORD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).send("relay_error:" + err.message);
  }
});

app.get("/", (req,res)=>res.send("ok")); // health check

app.listen(process.env.PORT || 3000);
