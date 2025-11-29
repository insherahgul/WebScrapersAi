import mongoose from "mongoose";

const ScraperSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  url: String,
  thumbnail: String,
  lastScraped: String,
});

export const Scraper =
  mongoose.models.Scraper || mongoose.model("Scraper", ScraperSchema);
