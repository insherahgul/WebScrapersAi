import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

const app = express();
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// -------------------- MongoDB Connection --------------------
mongoose.connect("mongodb+srv://insherahgul_db_user:ig123%40%40@webscraper.dtvd5ec.mongodb.net/webscraperai?retryWrites=true&w=majority")
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------- User Schema --------------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  uploadedJSON: [
    {
      filename: String,
      data: Object,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// -------------------- Auth Middleware --------------------
const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret") as { id: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// -------------------- Multer Setup --------------------
const upload = multer(); // Memory storage

// -------------------- Signup Route --------------------
app.post("/auth/signup", async (req: Request, res: Response) => {
  console.log("✅ Signup data received:", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// -------------------- Login Route --------------------
app.post("/auth/login", async (req: Request, res: Response) => {
  console.log("✅ Login attempt:", req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// -------------------- Dashboard Route --------------------
app.get("/dashboard", authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(`📊 Dashboard viewed by: ${user.name} (${user.email})`);
    res.status(200).json({ message: "Dashboard loaded", user });
  } catch (err) {
    console.error("❌ Dashboard request failed:", err);
    res.status(500).json({ message: "Dashboard request failed" });
  }
});

// -------------------- Customize Scraper Route --------------------
app.post("/customize-scraper", authMiddleware, upload.single("file"), async (req: Request & { user?: any }, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const jsonData = JSON.parse(file.buffer.toString());

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Store JSON in user's document
    user.uploadedJSON.push({
      filename: file.originalname,
      data: jsonData,
    });
    await user.save();

    console.log(`📄 JSON file "${file.originalname}" received and stored for user: ${user.email}`);
    res.status(200).json({ message: "JSON uploaded successfully", filename: file.originalname });
  } catch (err) {
    console.error("❌ Failed to upload JSON:", err);
    res.status(500).json({ message: "Failed to upload JSON" });
  }
});

// -------------------- Start Server --------------------
app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
