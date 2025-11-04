import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.all("*", async (req, res) => {
  const targetUrl = "https://api.correoargentino.com.ar" + req.originalUrl;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: req.headers.authorization || "",
      },
      body: ["GET", "HEAD"].includes(req.method) ? null : JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Proxy activo en puerto ${port}`));
