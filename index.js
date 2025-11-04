import express from "express";
import fetch from "node-fetch";

const app = express();

// Permitir recibir JSON o formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para proxy
app.all("*", async (req, res) => {
  const targetUrl = "https://api.correoargentino.com.ar" + req.originalUrl;

  try {
    const headers = {
      "Content-Type": req.headers["content-type"] || "application/json",
      "Accept": "application/json",
    };

    // Pasar la cabecera Authorization si viene del cliente
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization;
    }

    // Armar el body solo si corresponde
    const body =
      ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    // Pasar el status original y la respuesta
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error("❌ Error proxy:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Proxy activo en puerto ${port}`));
