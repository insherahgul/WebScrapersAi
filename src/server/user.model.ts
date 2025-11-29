import mongoose from "mongoose";

const CustomScraperSchema = new mongoose.Schema({
  filename: String,
  data: mongoose.Schema.Types.Mixed,
  uploadedAt: Date,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  customScrapers: [CustomScraperSchema],
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
