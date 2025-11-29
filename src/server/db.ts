import mongoose from "mongoose";

export async function connectDB() {
  try {
const MONGO_URI = "mongodb+srv://insherahgul_db_user:ig123%40%40@webscraper.dtvd5ec.mongodb.net/webscraperai?retryWrites=true&w=majority";

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected (Atlas)");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
}
