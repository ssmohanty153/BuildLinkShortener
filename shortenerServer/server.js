const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let port = process.env.PORT || 5000;
mongoose.connect("mongodb://127.0.0.1:27017/UrlShortener");

const UrlShortener = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
  },
  { versionKey: false }
);
const urlShortenerModel = mongoose.model("urlShortener", UrlShortener);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../ReactProject/build")));

// Handle React app requests

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  const url = await urlShortenerModel.findOne({ shortUrl });

  if (url) {
    const now = new Date();
    const createdAt = url.createdAt.getTime();
    const minutesElapsed = (now.getTime() - createdAt) / (1000 * 60);
    if (minutesElapsed > 5) {
      //res.status(404).send("URL has expired");
      return res.redirect(`http://localhost:${port}/`);
    }
    return res.redirect(url.originalUrl);
  }

  // res.status(404).send("Not found");

  return res.redirect(`http://localhost:${port}/`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../ReactProject/build/index.html"));
});

app.post("/api/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  console.log(req.body);

  // Check if the URL is valid
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Check if the URL already exists in the database

  const existingUrl = await urlShortenerModel.findOne({ originalUrl });
  if (existingUrl) {
    return res.json({
      shortUrl: `http://localhost:${port}/${existingUrl.shortUrl}`,
    });
  }

  // Generate a random string for the short URL
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortUrl = "";
  for (let i = 0; i < 6; i++) {
    shortUrl += chars[Math.floor(Math.random() * chars.length)];
  }

  // Save the URL to the database with a 5-minute expiration time
  const url = new urlShortenerModel({ originalUrl, shortUrl });
  await url.save();

  res.json({ shortUrl: `http://localhost:${port}/${shortUrl}` });
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
